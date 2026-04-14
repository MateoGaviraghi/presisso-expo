import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "./constants";

export const solicitudSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  whatsapp: z.string().optional().or(z.literal("")),
  email: z.string().email("Email inválido").min(1, "El email es requerido"),
  tipo_cocina: z.enum(["negro_mate"]),
  enviar_pdf: z.boolean().default(true),
});

export const clientFormSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "Nombre demasiado largo"),
  whatsapp: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email("Ingresá un email válido").min(1, "El email es requerido"),
  tipo_cocina: z.enum(["negro_mate"]),
  enviar_pdf: z.boolean(),
});

export const fileSchema = z.object({
  size: z
    .number()
    .max(MAX_FILE_SIZE, "El archivo es demasiado grande (máx 10MB)"),
  type: z
    .string()
    .refine(
      (type) => ACCEPTED_IMAGE_TYPES.includes(type),
      "Formato no soportado. Usá JPG, PNG o WebP",
    ),
});

export const validateImageFile = (file: File): string | null => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "Solo se aceptan imágenes JPG, PNG o WebP";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "La imagen no puede superar los 10MB";
  }
  return null;
};

export type SolicitudFormData = z.infer<typeof solicitudSchema>;
export type ClientFormData = z.infer<typeof clientFormSchema>;
