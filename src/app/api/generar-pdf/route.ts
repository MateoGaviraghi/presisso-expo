import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { customAlphabet } from "nanoid";
import { supabaseAdmin, createAdminClient } from "@/lib/supabase/admin";
import { generatePDF } from "@/lib/pdf/generator";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { solicitudIdBody, parseBody } from "@/lib/validations/api";
import { logAction } from "@/lib/audit";

const generateShortToken = customAlphabet(
  "0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  10,
);

export const maxDuration = 60;

const MAX_RETRIES = 2;

async function uploadWithRetry(
  fileName: string,
  buffer: Buffer,
  contentType: string,
): Promise<void> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const client = createAdminClient();
      const { error } = await client.storage
        .from("cocinas")
        .upload(fileName, buffer, { contentType, upsert: true });

      if (error) {
        console.error(`Storage upload error (intento ${attempt + 1}):`, error);
        if (attempt < MAX_RETRIES) continue;
        throw error;
      }
      return;
    } catch (err) {
      if (attempt >= MAX_RETRIES) throw err;
      console.error(`Upload retry ${attempt + 1}:`, err);
    }
  }
}

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
    await uploadWithRetry(fileName, pdfBuffer, "application/pdf");

    const { data: urlData } = supabaseAdmin.storage
      .from("cocinas")
      .getPublicUrl(fileName);

    const pdfUrl = `${urlData.publicUrl}?v=${Date.now()}`;

    const updatePayload: { pdf_url: string; short_token?: string } = { pdf_url: pdfUrl };
    if (!solicitud.short_token) {
      updatePayload.short_token = generateShortToken();
    }

    await supabaseAdmin
      .from("solicitudes")
      .update(updatePayload)
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
