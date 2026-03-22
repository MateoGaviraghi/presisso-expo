import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateWithFallback } from "@/lib/gemini/generate";
import type { PromptType } from "@/lib/gemini/prompts";
import { solicitudIdBody, parseBody } from "@/lib/validations/api";

export const maxDuration = 60;

// Safety margin: abort 5s before Vercel kills the function
const TIMEOUT_MS = 55_000;

export async function POST(req: NextRequest) {
  // Verificar secret interno — solo llamadas server-to-server autorizadas
  const secret = req.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = parseBody(solicitudIdBody, body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { solicitud_id } = parsed.data;

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

  // 3. Generar imagen con timeout safety net
  const startTime = Date.now();

  try {
    const result = await Promise.race([
      generateWithFallback(
        solicitud.foto_original,
        solicitud.tipo_cocina as PromptType,
      ),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Timeout: generación excedió ${TIMEOUT_MS / 1000}s`)),
          TIMEOUT_MS,
        ),
      ),
    ]);

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
    const imageBytes = Uint8Array.from(atob(result.imageBase64), (c) =>
      c.charCodeAt(0),
    );
    const blob = new Blob([imageBytes], { type: "image/png" });
    const fileName = `generadas/${solicitud_id}-${Date.now()}.png`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("cocinas")
      .upload(fileName, blob, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Error subiendo imagen generada:", uploadError);
      Sentry.captureException(uploadError, {
        extra: { solicitud_id, paso: "storage_upload" },
      });

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
  } catch (err) {
    const elapsed = Date.now() - startTime;
    const isTimeout =
      err instanceof Error && err.message.startsWith("Timeout:");
    const errorMsg = isTimeout
      ? `Timeout después de ${Math.round(elapsed / 1000)}s — reintentá más tarde`
      : err instanceof Error
        ? err.message
        : "Error desconocido en generación";

    console.error(`[generar-imagen] ${errorMsg}`, { solicitud_id, elapsed });
    Sentry.captureException(err, {
      extra: { solicitud_id, elapsed, isTimeout },
    });

    await supabaseAdmin
      .from("solicitudes")
      .update({
        estado: "error",
        tiempo_generacion_ms: elapsed,
        notas_admin: errorMsg,
      })
      .eq("id", solicitud_id);

    return NextResponse.json(
      { error: errorMsg },
      { status: isTimeout ? 504 : 500 },
    );
  }
}
