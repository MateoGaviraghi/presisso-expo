-- ============================================
-- Migración: Renombrar tipo_cocina premium → negro_mate, eliminar moderna
-- ============================================

-- 1. Actualizar registros existentes
UPDATE solicitudes SET tipo_cocina = 'negro_mate' WHERE tipo_cocina = 'premium';
UPDATE solicitudes SET tipo_cocina = 'negro_mate' WHERE tipo_cocina = 'moderna';

-- 2. Eliminar CHECK constraint viejo y crear el nuevo
ALTER TABLE solicitudes DROP CONSTRAINT IF EXISTS solicitudes_tipo_cocina_check;
ALTER TABLE solicitudes ADD CONSTRAINT solicitudes_tipo_cocina_check CHECK (tipo_cocina IN ('negro_mate'));
