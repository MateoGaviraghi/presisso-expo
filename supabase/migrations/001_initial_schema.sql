-- ============================================
-- PRESISSO EXPO — Schema Inicial
-- ============================================

-- Tabla principal de solicitudes
CREATE TABLE solicitudes (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Datos del cliente
  nombre          TEXT NOT NULL,
  whatsapp        TEXT NOT NULL,
  email           TEXT,

  -- Configuración
  tipo_cocina     TEXT NOT NULL CHECK (tipo_cocina IN ('negro_mate')),
  enviar_pdf      BOOLEAN DEFAULT true,

  -- Imágenes
  foto_original   TEXT NOT NULL,         -- URL en Supabase Storage
  imagen_generada TEXT,                  -- URL imagen IA generada
  imagen_generada_2 TEXT,                -- URL backup/alternativa

  -- Estado del flujo
  estado          TEXT DEFAULT 'pendiente' NOT NULL
                  CHECK (estado IN (
                    'pendiente',         -- recién creada
                    'generando',         -- IA procesando
                    'revision',          -- imagen lista para revisión humana
                    'aprobada',          -- aprobada, generando PDF
                    'enviada',           -- PDF enviado al cliente
                    'rechazada',         -- imagen rechazada
                    'error'              -- error en algún paso
                  )),

  -- Metadatos IA
  prompt_usado    TEXT,                  -- prompt exacto enviado a Gemini
  modelo_ia       TEXT DEFAULT 'imagen-4.0-generate-001',
  intentos_generacion INT DEFAULT 0,
  tiempo_generacion_ms INT,

  -- Metadatos envío
  pdf_url         TEXT,                  -- URL del PDF generado
  whatsapp_sid    TEXT,                  -- SID de Twilio (tracking)
  email_id        TEXT,                  -- ID de Resend (tracking)
  enviado_at      TIMESTAMPTZ,

  -- Notas internas
  notas_admin     TEXT
);

-- Índices para queries frecuentes
CREATE INDEX idx_solicitudes_estado ON solicitudes(estado);
CREATE INDEX idx_solicitudes_created ON solicitudes(created_at DESC);
CREATE INDEX idx_solicitudes_tipo ON solicitudes(tipo_cocina);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER solicitudes_updated_at
  BEFORE UPDATE ON solicitudes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Storage bucket para fotos
INSERT INTO storage.buckets (id, name, public)
VALUES ('fotos-cocinas', 'fotos-cocinas', true);

-- Policy: cualquiera puede subir fotos (público para la expo)
CREATE POLICY "Público puede subir fotos"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'fotos-cocinas');

-- Policy: cualquiera puede ver fotos
CREATE POLICY "Público puede ver fotos"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'fotos-cocinas');

-- Habilitar Realtime para la tabla solicitudes
ALTER PUBLICATION supabase_realtime ADD TABLE solicitudes;

-- Vista para estadísticas del dashboard
CREATE VIEW stats_expo AS
SELECT
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE estado IN ('pendiente', 'generando', 'revision')) AS en_proceso,
  COUNT(*) FILTER (WHERE estado = 'enviada') AS enviadas,
  COUNT(*) FILTER (WHERE estado = 'rechazada') AS rechazadas,
  COUNT(*) FILTER (WHERE estado = 'error') AS errores,
  AVG(tiempo_generacion_ms) FILTER (WHERE tiempo_generacion_ms IS NOT NULL) AS promedio_generacion_ms,
  COUNT(*) FILTER (WHERE created_at > now() - INTERVAL '1 day') AS total_hoy
FROM solicitudes;
