import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/sender";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const solicitud_id = body?.solicitud_id;

  if (!solicitud_id) {
    return NextResponse.json({ error: "solicitud_id requerido" }, { status: 400 });
  }

  const { data: solicitud, error } = await supabaseAdmin
    .from("solicitudes")
    .select("*")
    .eq("id", solicitud_id)
    .single();

  if (error || !solicitud) {
    return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  }

  if (!solicitud.email) {
    return NextResponse.json({ error: "El cliente no tiene email registrado" }, { status: 422 });
  }

  if (!solicitud.pdf_url || !solicitud.imagen_generada) {
    return NextResponse.json({ error: "Falta PDF o imagen generada" }, { status: 422 });
  }

  try {
    const emailId = await sendEmail({
      to: solicitud.email,
      nombre: solicitud.nombre,
      tipoCocina: solicitud.tipo_cocina,
      pdfUrl: solicitud.pdf_url,
      imagenUrl: solicitud.imagen_generada,
    });

    await supabaseAdmin
      .from("solicitudes")
      .update({ email_id: emailId ?? null })
      .eq("id", solicitud_id);

    return NextResponse.json({ success: true, emailId });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: "Error enviando email" }, { status: 500 });
  }
}
