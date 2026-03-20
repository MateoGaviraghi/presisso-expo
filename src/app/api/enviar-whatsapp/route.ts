import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendWhatsApp } from "@/lib/whatsapp/sender";

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

  if (!solicitud.pdf_url) {
    return NextResponse.json({ error: "El PDF aún no fue generado" }, { status: 422 });
  }

  try {
    const sid = await sendWhatsApp({
      to: solicitud.whatsapp,
      nombre: solicitud.nombre,
      tipoCocina: solicitud.tipo_cocina,
      pdfUrl: solicitud.pdf_url,
    });

    await supabaseAdmin
      .from("solicitudes")
      .update({ whatsapp_sid: sid, estado: "enviada", enviado_at: new Date().toISOString() })
      .eq("id", solicitud_id);

    return NextResponse.json({ success: true, sid });
  } catch (err) {
    console.error("WhatsApp error:", err);
    return NextResponse.json({ error: "Error enviando WhatsApp" }, { status: 500 });
  }
}
