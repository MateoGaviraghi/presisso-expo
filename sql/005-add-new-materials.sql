-- ============================================
-- Migración: Agregar nuevos materiales al constraint
-- ============================================

-- Paso 1: Borrar constraint actual
ALTER TABLE solicitudes DROP CONSTRAINT IF EXISTS solicitudes_tipo_cocina_check;

-- Paso 2: Crear constraint con los 4 materiales
ALTER TABLE solicitudes ADD CONSTRAINT solicitudes_tipo_cocina_check
  CHECK (tipo_cocina IN ('politex_negro', 'melamina_litio', 'politex_gris_grafito', 'melamina_grafito_scotch'));
