export const APP_NAME = "Presisso Expo";
export const APP_DESCRIPTION = "Sistema de visualización de cocinas con IA";

export const TIPOS_COCINA = ["moderna", "premium"] as const;

export const KITCHEN_TYPES = {
  moderna: {
    id: "moderna",
    label: "Línea Moderna",
    tag: "Tendencia 2026",
    description: "Líneas limpias, acabados minimalistas, tiradores integrados",
    image: "/modelo-premiun/Presisso_28022026_02.jpg",
  },
  premium: {
    id: "premium",
    label: "Línea Premium",
    tag: "Exclusiva",
    description: "Materiales nobles, detalles de lujo, herrajes importados",
    image: "/modelo-premiun/Presisso_28022026_12.jpg",
  },
} as const;

export type KitchenType = keyof typeof KITCHEN_TYPES;

export const STEPS = [
  { id: 0, label: "Foto", icon: "camera" },
  { id: 1, label: "Estilo", icon: "palette" },
  { id: 2, label: "Datos", icon: "user" },
  { id: 3, label: "Enviar", icon: "check" },
] as const;

export const ESTADOS_SOLICITUD = [
  "generando",
  "revision",
  "aprobada",
  "enviada",
  "error",
] as const;

export const ESTADO_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  generando: "Generando IA",
  revision: "En Revisión",
  aprobada: "Aprobada",
  enviada: "Enviada",
  error: "Error",
};

export const STORAGE_BUCKET = "cocinas";

export const STORAGE_PATHS = {
  originales: "originales",
  generadas: "generadas",
  pdfs: "pdfs",
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
