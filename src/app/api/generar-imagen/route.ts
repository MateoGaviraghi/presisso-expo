import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateWithRetry } from "@/lib/gemini/generate";
import type { PromptType } from "@/lib/gemini/prompts";

// Vercel: timeout extendido para generación IA
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const solicitud_id = body?.solicitud_id;

  if (!solicitud_id) {
    return NextResponse.json(
      { error: "solicitud_id requerido" },
      { status: 400 },
    );
  }

  // 1. Obtener la solicitud
  const { data: solicitud, error } = await supabaseAdmin
    .from("solicitudes")
    .select("*")
    .eq("id", solicitud_id)
    .single();

  if (error || !solicitud) {
    return NextResponse.json(
      { error: "Solicitud no encontrada" },
      { status: 404 },
    );
  }

  if (!solicitud.foto_original) {
    return NextResponse.json(
      { error: "La solicitud no tiene foto original" },
      { status: 422 },
    );
  }

  // 2. Marcar como "generando"
  await supabaseAdmin
    .from("solicitudes")
    .update({
      estado: "generando",
      intentos_generacion: (solicitud.intentos_generacion ?? 0) + 1,
    })
    .eq("id", solicitud_id);

  // 3. Generar imagen con reintentos + fallback
  const result = await generateWithRetry(
    solicitud.foto_original,
    solicitud.tipo_cocina as PromptType,
  );

  if (!result.success || !result.imageBase64) {
    await supabaseAdmin
      .from("solicitudes")
      .update({
        estado: "error",
        tiempo_generacion_ms: result.timeMs,
        notas_admin: `Error generación IA: ${result.error}`,
      })
      .eq("id", solicitud_id);

    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // 4. Subir imagen generada a Supabase Storage
  const imageBuffer = Buffer.from(result.imageBase64, "base64");
  const fileName = `generadas/${solicitud_id}-${Date.now()}.png`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("cocinas")
    .upload(fileName, imageBuffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (uploadError) {
    console.error("Error subiendo imagen generada:", uploadError);
    await supabaseAdmin
      .from("solicitudes")
      .update({
        estado: "error",
        notas_admin: `Error storage: ${uploadError.message}`,
      })
      .eq("id", solicitud_id);

    return NextResponse.json(
      { error: "Error almacenando imagen generada" },
      { status: 500 },
    );
  }

  const { data: urlData } = supabaseAdmin.storage
    .from("cocinas")
    .getPublicUrl(fileName);

  // 5. Actualizar solicitud con la imagen generada
  await supabaseAdmin
    .from("solicitudes")
    .update({
      estado: "revision",
      imagen_generada: urlData.publicUrl,
      prompt_usado: result.promptUsed,
      modelo_ia: result.model,
      tiempo_generacion_ms: result.timeMs,
    })
    .eq("id", solicitud_id);

  return NextResponse.json({
    success: true,
    imagen_url: urlData.publicUrl,
    model: result.model,
    time_ms: result.timeMs,
  });
}
