import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/sender";
import { requireAdmin } from "@/lib/auth/admin-guard";
import { solicitudIdBody, parseBody } from "@/lib/validations/api";
import { logAction } from "@/lib/audit";

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

  if (!solicitud.email) {
    return NextResponse.json(
      { error: "El cliente no tiene email registrado" },
      { status: 422 },
    );
  }

  if (!solicitud.pdf_url || !solicitud.imagen_generada) {
    return NextResponse.json(
      { error: "Falta PDF o imagen generada" },
      { status: 422 },
    );
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
      .update({
        email_id: emailId ?? null,
        estado: "enviada",
        enviado_at: new Date().toISOString(),
      })
      .eq("id", solicitud_id);

    logAction(solicitud_id, "enviar_email", { email: solicitud.email, emailId });
    return NextResponse.json({ success: true, emailId });
  } catch (err) {
    console.error("Email error:", err);
    Sentry.captureException(err, { extra: { solicitud_id } });
    return NextResponse.json(
      { error: "Error enviando email" },
      { status: 500 },
    );
  }
}
