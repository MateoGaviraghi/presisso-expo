export const APP_NAME = "Presisso Expo";
export const APP_DESCRIPTION = "Sistema de visualización de cocinas con IA";

export const MATERIALES = [
  "politex_negro",
  "melamina_litio",
  "politex_gris_grafito",
  "melamina_grafito_scotch",
  "polimero_blanco_gloss",
] as const;

export const MATERIAL_OPTIONS = {
  politex_negro: {
    id: "politex_negro",
    material: "Politex",
    color: "Negro",
    label: "Politex Negro",
    tag: "Exclusiva",
    description: "Acabado negro mate con nano-textura, diseño flat slab, herrajes importados",
    image: "/politex-negro/Presisso_28022026_12.jpg",
  },
  polimero_blanco_gloss: {
    id: "polimero_blanco_gloss",
    material: "Polímero táctil",
    color: "White Gloss",
    label: "Polímero táctil White Gloss",
    tag: "Gloss",
    description: "Polímero ultra gloss blanco puro efecto espejo, perfil Gola negro, mesada PRESTONE Rose",
    image: "/polimero-tactil-white-gloss/presisso-exp-2026-72.jpg",
  },
  politex_gris_grafito: {
    id: "politex_gris_grafito",
    material: "Politex",
    color: "Gris Grafito",
    label: "Politex Gris Grafito",
    tag: "Elegante",
    description: "Acabado gris grafito mate con nano-textura, diseño flat slab, herrajes importados",
    image: "/politex-gris-grafito/IMG_7549-Pano.jpg.jpg",
  },
  melamina_litio: {
    id: "melamina_litio",
    material: "Melamina",
    color: "Litio",
    label: "Melamina Litio",
    tag: "Cálida",
    description: "Melamina tono cálido claro con superficie lisa y veta sutil, diseño flat slab",
    image: "/melamina-litio/MPucci_Presisso_20210323_082.jpg",
  },
  melamina_grafito_scotch: {
    id: "melamina_grafito_scotch",
    material: "Melamina",
    color: "Grafito Scotch",
    label: "Melamina Grafito Scotch",
    tag: "Premium",
    description: "Melamina grafito con textura scotch grain, tono carbón oscuro con relieve táctil",
    image: "/melamina-grafito-scotch/DSC05054.jpg",
  },
} as const;

export type MaterialColorKey = keyof typeof MATERIAL_OPTIONS;

export function getMaterialLabel(tipoCocina: string): string {
  const mat = MATERIAL_OPTIONS[tipoCocina as MaterialColorKey];
  return mat ? mat.label : tipoCocina;
}

export const STEPS = [
  { id: 0, label: "Modo", icon: "sparkles" },
  { id: 1, label: "Foto", icon: "camera" },
  { id: 2, label: "Material", icon: "palette" },
  { id: 3, label: "Datos", icon: "user" },
  { id: 4, label: "Enviar", icon: "check" },
] as const;

export const ESTADOS_SOLICITUD = [
  "generando",
  "revision",
  "aprobada",
  "enviada",
  "error",
] as const;

export const MODO_OPTIONS = {
  rediseno: {
    id: "rediseno" as const,
    label: "Renovar mi cocina",
    description: "Ya tengo muebles y quiero ver cómo quedarían con amoblamientos Presisso",
    icon: "refresh",
  },
  diseno: {
    id: "diseno" as const,
    label: "Diseñar desde cero",
    description: "Tengo el espacio vacío y quiero ver cómo quedaría una cocina Presisso completa",
    icon: "plus",
  },
} as const;

export const MODO_LABELS: Record<string, string> = {
  rediseno: "Rediseño",
  diseno: "Diseño nuevo",
};

export function getModoLabel(modo: string): string {
  return MODO_LABELS[modo] ?? modo;
}

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
