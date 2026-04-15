-- ============================================
-- Migración: Renombrar tipo_cocina negro_mate → politex_negro
-- ============================================
-- EJECUTAR EN ESTE ORDEN (dos queries separadas en Supabase SQL Editor):

-- ═══════════════════════════════════════════════
-- PASO 1: Primero borrar el constraint viejo
-- (ejecutar esto solo)
-- ═══════════════════════════════════════════════
ALTER TABLE solicitudes DROP CONSTRAINT IF EXISTS solicitudes_tipo_cocina_check;

-- ═══════════════════════════════════════════════
-- PASO 2: Después ejecutar esto
-- (actualizar datos + nuevo constraint)
-- ═══════════════════════════════════════════════
UPDATE solicitudes SET tipo_cocina = 'politex_negro' WHERE tipo_cocina = 'negro_mate';
ALTER TABLE solicitudes ADD CONSTRAINT solicitudes_tipo_cocina_check CHECK (tipo_cocina IN ('politex_negro'));
