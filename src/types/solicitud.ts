export type EstadoSolicitud =
  | "pendiente"
  | "generando"
  | "revision"
  | "aprobada"
  | "enviada"
  | "rechazada"
  | "error";

export type TipoCocina = "moderna" | "premium";

export interface Solicitud {
  id: string;
  created_at: string;
  updated_at: string;
  nombre: string;
  whatsapp: string;
  email: string | null;
  tipo_cocina: TipoCocina;
  enviar_pdf: boolean;
  foto_original: string;
  imagen_generada: string | null;
  imagen_generada_2: string | null;
  estado: EstadoSolicitud;
  prompt_usado: string | null;
  modelo_ia: string;
  intentos_generacion: number;
  tiempo_generacion_ms: number | null;
  pdf_url: string | null;
  whatsapp_sid: string | null;
  email_id: string | null;
  enviado_at: string | null;
  notas_admin: string | null;
}
