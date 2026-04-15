// Tipos generados por Supabase — se reemplazan con `supabase gen types`
// Por ahora placeholder manual basado en el schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      solicitudes: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          nombre: string;
          whatsapp: string;
          email: string | null;
          tipo_cocina: string;
          modo: string;
          enviar_pdf: boolean;
          foto_original: string;
          imagen_generada: string | null;
          imagen_generada_2: string | null;
          estado: string;
          prompt_usado: string | null;
          modelo_ia: string;
          intentos_generacion: number;
          tiempo_generacion_ms: number | null;
          pdf_url: string | null;
          whatsapp_sid: string | null;
          email_id: string | null;
          enviado_at: string | null;
          notas_admin: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          nombre: string;
          whatsapp: string;
          email?: string | null;
          tipo_cocina: string;
          modo?: string;
          enviar_pdf?: boolean;
          foto_original: string;
          imagen_generada?: string | null;
          imagen_generada_2?: string | null;
          estado?: string;
          prompt_usado?: string | null;
          modelo_ia?: string;
          intentos_generacion?: number;
          tiempo_generacion_ms?: number | null;
          pdf_url?: string | null;
          whatsapp_sid?: string | null;
          email_id?: string | null;
          enviado_at?: string | null;
          notas_admin?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          nombre?: string;
          whatsapp?: string;
          email?: string | null;
          tipo_cocina?: string;
          modo?: string;
          enviar_pdf?: boolean;
          foto_original?: string;
          imagen_generada?: string | null;
          imagen_generada_2?: string | null;
          estado?: string;
          prompt_usado?: string | null;
          modelo_ia?: string;
          intentos_generacion?: number;
          tiempo_generacion_ms?: number | null;
          pdf_url?: string | null;
          whatsapp_sid?: string | null;
          email_id?: string | null;
          enviado_at?: string | null;
          notas_admin?: string | null;
        };
      };
    };
    Views: {
      stats_expo: {
        Row: {
          total: number;
          en_proceso: number;
          enviadas: number;
          rechazadas: number;
          errores: number;
          promedio_generacion_ms: number | null;
          total_hoy: number;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
