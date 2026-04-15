import type { Solicitud, MaterialColor, ModoSolicitud } from "./solicitud";

// POST /api/solicitudes
export interface CreateSolicitudRequest {
  nombre: string;
  whatsapp: string;
  email?: string;
  tipo_cocina: MaterialColor;
  modo: ModoSolicitud;
  enviar_pdf?: boolean;
  foto_original: string;
}

export interface CreateSolicitudResponse {
  data: Solicitud;
}

// PATCH /api/solicitudes/[id]
export interface UpdateSolicitudRequest {
  estado?: string;
  imagen_generada?: string;
  notas_admin?: string;
}

// POST /api/generar-imagen
export interface GenerarImagenRequest {
  solicitud_id: string;
}

export interface GenerarImagenResponse {
  imagen_url: string;
  tiempo_ms: number;
}

// POST /api/generar-pdf
export interface GenerarPdfRequest {
  solicitud_id: string;
}

export interface GenerarPdfResponse {
  pdf_url: string;
}

// POST /api/enviar-email
export interface EnviarEmailRequest {
  solicitud_id: string;
}

// Generic API response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
