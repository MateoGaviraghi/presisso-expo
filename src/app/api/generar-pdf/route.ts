import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generatePDF } from "@/lib/pdf/generator";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { solicitudIdBody, parseBody } from "@/lib/validations/api";
import { logAction } from "@/lib/audit";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const parsed = parseBody(solicitudIdBody, body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { solicitud_id } = parsed.data;

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

  if (!solicitud.imagen_generada) {
    return NextResponse.json(
      { error: "La solicitud aún no tiene imagen generada" },
      { status: 422 },
    );
  }

  try {
    const pdfBuffer = await generatePDF(solicitud);

    const fileName = `pdfs/${solicitud_id}.pdf`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from("cocinas")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabaseAdmin.storage
      .from("cocinas")
      .getPublicUrl(fileName);

    const pdfUrl = `${urlData.publicUrl}?v=${Date.now()}`;

    await supabaseAdmin
      .from("solicitudes")
      .update({ pdf_url: pdfUrl })
      .eq("id", solicitud_id);

    logAction(solicitud_id, "generar_pdf", { pdf_url: pdfUrl });
    return NextResponse.json({ success: true, pdf_url: pdfUrl });
  } catch (err) {
    console.error("Error generando PDF:", err);
    Sentry.captureException(err, { extra: { solicitud_id } });
    return NextResponse.json(
      { error: "Error al generar el PDF" },
      { status: 500 },
    );
  }
}
