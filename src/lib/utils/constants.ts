export const APP_NAME = "Presisso Expo";
export const APP_DESCRIPTION = "Sistema de visualización de cocinas con IA";

export const MATERIALES = ["politex_negro"] as const;

export const MATERIAL_OPTIONS = {
  politex_negro: {
    id: "politex_negro",
    material: "Politex",
    color: "Negro",
    label: "Politex Negro",
    tag: "Exclusiva",
    description: "Acabado negro mate con nano-textura, diseño flat slab, herrajes importados",
    image: "/Politex - Negro/Presisso_28022026_12.jpg",
  },
} as const;

export type MaterialColorKey = keyof typeof MATERIAL_OPTIONS;

export function getMaterialLabel(tipoCocina: string): string {
  const mat = MATERIAL_OPTIONS[tipoCocina as MaterialColorKey];
  return mat ? mat.label : tipoCocina;
}

export const STEPS = [
  { id: 0, label: "Foto", icon: "camera" },
  { id: 1, label: "Material", icon: "palette" },
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
