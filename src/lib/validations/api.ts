import { z } from "zod";

// ── Shared ──────────────────────────────────────────────────────────
export const solicitudIdBody = z.object({
  solicitud_id: z.string().uuid("solicitud_id debe ser un UUID válido"),
});

export const uuidParam = z.string().uuid("ID inválido");

// ── PATCH /api/solicitudes/[id] ─────────────────────────────────────
export const patchSolicitud = z
  .object({
    estado: z
      .enum(["generando", "revision", "aprobada", "enviada", "error"])
      .optional(),
    tipo_cocina: z.enum(["politex_negro"]).optional(),
    imagen_generada: z.string().optional(),
    imagen_generada_2: z.string().nullable().optional(),
    prompt_usado: z.string().nullable().optional(),
    modelo_ia: z.string().optional(),
    intentos_generacion: z.number().int().min(0).optional(),
    tiempo_generacion_ms: z.number().nullable().optional(),
    pdf_url: z.string().nullable().optional(),
    email_id: z.string().nullable().optional(),
    enviado_at: z.string().nullable().optional(),
    notas_admin: z.string().max(2000).nullable().optional(),
  })
  .strict();

// ── Zod helper: parse body and return data or error Response ────────
export function parseBody<T extends z.ZodType>(
  schema: T,
  data: unknown,
): { success: true; data: z.infer<T> } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const msg = result.error.issues.map((i) => i.message).join("; ");
    return { success: false, error: msg };
  }
  return { success: true, data: result.data };
}
