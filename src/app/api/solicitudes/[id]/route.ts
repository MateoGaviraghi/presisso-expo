import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// GET /api/solicitudes/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { data, error } = await supabaseAdmin
    .from("solicitudes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Solicitud no encontrada" },
      { status: 404 },
    );
  }

  return NextResponse.json(data);
}

// PATCH /api/solicitudes/:id — Actualizar campos permitidos
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();

    // Campos permitidos para actualizar (whitelist explícita)
    const allowedFields = [
      "estado",
      "imagen_generada",
      "imagen_generada_2",
      "prompt_usado",
      "modelo_ia",
      "intentos_generacion",
      "tiempo_generacion_ms",
      "pdf_url",
      "whatsapp_sid",
      "email_id",
      "enviado_at",
      "notas_admin",
    ] as const;

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No hay campos válidos para actualizar" },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("solicitudes")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("PATCH /api/solicitudes/:id error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("PATCH /api/solicitudes/:id unexpected error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
