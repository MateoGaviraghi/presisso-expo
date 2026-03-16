export const APP_NAME = "Presisso Expo";
export const APP_DESCRIPTION = "Sistema de visualización de cocinas con IA";

export const TIPOS_COCINA = ["moderna", "premium"] as const;

export const ESTADOS_SOLICITUD = [
  "pendiente",
  "generando",
  "revision",
  "aprobada",
  "enviada",
  "rechazada",
  "error",
] as const;

export const ESTADO_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  generando: "Generando IA",
  revision: "En Revisión",
  aprobada: "Aprobada",
  enviada: "Enviada",
  rechazada: "Rechazada",
  error: "Error",
};

export const STORAGE_BUCKET = "fotos-cocinas";

export const STORAGE_PATHS = {
  originales: "originales",
  generadas: "generadas",
  pdfs: "pdfs",
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
