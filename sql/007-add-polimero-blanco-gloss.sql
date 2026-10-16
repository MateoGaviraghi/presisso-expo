-- ============================================
-- Migración: Agregar "polimero_blanco_gloss" al constraint de materiales
-- ============================================
-- Este archivo documenta un cambio que ya está aplicado en producción
-- (hay solicitudes guardadas con este material) y que nunca se había
-- subido al repo (el commit 9c8427c lo nombra). NO hace falta correrlo
-- otra vez en producción.

ALTER TABLE solicitudes DROP CONSTRAINT IF EXISTS solicitudes_tipo_cocina_check;

ALTER TABLE solicitudes ADD CONSTRAINT solicitudes_tipo_cocina_check
  CHECK (tipo_cocina IN ('politex_negro', 'melamina_litio', 'politex_gris_grafito', 'melamina_grafito_scotch', 'polimero_blanco_gloss'));
