import { supabaseAdmin } from "@/lib/supabase/admin";

type AuditAction =
  | "generar_imagen"
  | "aprobar"
  | "regenerar"
  | "generar_pdf"
  | "enviar_email"
  | "guardar_notas"
  | "recovery";

/**
 * Logs an admin action to the audit_log table.
 * Fire-and-forget: errors are logged but don't block the caller.
 */
export async function logAction(
  solicitudId: string,
  accion: AuditAction,
  detalle?: Record<string, unknown>,
): Promise<void> {
  try {
    await supabaseAdmin.from("audit_log").insert({
      solicitud_id: solicitudId,
      accion,
      detalle: detalle ?? {},
    });
  } catch (err) {
    console.error("[audit] Error logging action:", accion, err);
  }
}
