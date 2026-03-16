import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "./constants";

export const solicitudSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  whatsapp: z
    .string()
    .min(8, "Número de WhatsApp inválido")
    .regex(/^\+?[\d\s-]+$/, "Formato de número inválido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  tipo_cocina: z.enum(["moderna", "premium"]),
  enviar_pdf: z.boolean().default(true),
});

export const fileSchema = z.object({
  size: z.number().max(MAX_FILE_SIZE, "El archivo es demasiado grande (máx 10MB)"),
  type: z.string().refine(
    (type) => ACCEPTED_IMAGE_TYPES.includes(type),
    "Formato no soportado. Usá JPG, PNG o WebP"
  ),
});

export type SolicitudFormData = z.infer<typeof solicitudSchema>;
