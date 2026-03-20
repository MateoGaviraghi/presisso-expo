import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generatePDF } from "@/lib/pdf/generator";

export const maxDuration = 60;

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

  if (!solicitud.imagen_generada) {
    return NextResponse.json({ error: "La solicitud aún no tiene imagen generada" }, { status: 422 });
  }

  try {
    const pdfBuffer = await generatePDF(solicitud);

    const fileName = `pdfs/${solicitud_id}.pdf`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("cocinas")
      .upload(fileName, pdfBuffer, { contentType: "application/pdf", upsert: true });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabaseAdmin.storage.from("cocinas").getPublicUrl(fileName);

    // Agregar cache-buster para evitar que Supabase CDN sirva versión vieja
    const pdfUrl = `${urlData.publicUrl}?v=${Date.now()}`;

    await supabaseAdmin
      .from("solicitudes")
      .update({ pdf_url: pdfUrl })
      .eq("id", solicitud_id);

    return NextResponse.json({ success: true, pdf_url: pdfUrl });
  } catch (err) {
    console.error("Error generando PDF:", err);
    return NextResponse.json({ error: "Error al generar el PDF" }, { status: 500 });
  }
}
