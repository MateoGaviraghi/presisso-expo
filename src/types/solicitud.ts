export type EstadoSolicitud =
  | "generando"
  | "revision"
  | "aprobada"
  | "enviada"
  | "error";

export type TipoCocina = "moderna" | "premium";

// ── Base fields shared by all states ────────────────────────────────
interface SolicitudBase {
  id: string;
  created_at: string;
  updated_at: string;
  nombre: string;
  whatsapp: string;
  email: string | null;
  tipo_cocina: TipoCocina;
  enviar_pdf: boolean;
  foto_original: string;
  imagen_generada_2: string | null;
  modelo_ia: string;
  intentos_generacion: number;
  notas_admin: string | null;
  whatsapp_sid: string | null;
}

// ── Discriminated unions by estado ──────────────────────────────────

interface SolicitudGenerando extends SolicitudBase {
  estado: "generando";
  imagen_generada: string | null;
  tiempo_generacion_ms: number | null;
  pdf_url: string | null;
  email_id: string | null;
  enviado_at: string | null;
  prompt_usado: string | null;
}

interface SolicitudRevision extends SolicitudBase {
  estado: "revision";
  imagen_generada: string;
  tiempo_generacion_ms: number;
  pdf_url: string | null;
  email_id: string | null;
  enviado_at: string | null;
  prompt_usado: string;
}

interface SolicitudAprobada extends SolicitudBase {
  estado: "aprobada";
  imagen_generada: string;
  tiempo_generacion_ms: number;
  pdf_url: string | null;
  email_id: string | null;
  enviado_at: string | null;
  prompt_usado: string;
}

interface SolicitudEnviada extends SolicitudBase {
  estado: "enviada";
  imagen_generada: string;
  tiempo_generacion_ms: number;
  pdf_url: string;
  email_id: string | null;
  enviado_at: string;
  prompt_usado: string;
}

interface SolicitudError extends SolicitudBase {
  estado: "error";
  imagen_generada: string | null;
  tiempo_generacion_ms: number | null;
  pdf_url: string | null;
  email_id: string | null;
  enviado_at: string | null;
  prompt_usado: string | null;
}

export type Solicitud =
  | SolicitudGenerando
  | SolicitudRevision
  | SolicitudAprobada
  | SolicitudEnviada
  | SolicitudError;

// ── Type guards ─────────────────────────────────────────────────────

export function hasImage(s: Solicitud): s is SolicitudRevision | SolicitudAprobada | SolicitudEnviada {
  return s.estado === "revision" || s.estado === "aprobada" || s.estado === "enviada";
}

export function isEnviada(s: Solicitud): s is SolicitudEnviada {
  return s.estado === "enviada";
}

// ── Payload for creating new solicitudes ────────────────────────────

export interface CreateSolicitudPayload {
  nombre: string;
  whatsapp: string;
  email?: string;
  tipo_cocina: "moderna" | "premium";
  enviar_pdf: boolean;
  foto_original: string;
}
