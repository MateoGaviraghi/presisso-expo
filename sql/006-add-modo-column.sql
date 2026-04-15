-- ============================================
-- Migración: Agregar columna 'modo' a solicitudes
-- Valores: 'rediseno' (renovar cocina existente) o 'diseno' (cocina desde cero)
-- ============================================

-- Paso 1: Agregar columna con default 'rediseno' (backwards compatible)
ALTER TABLE solicitudes
ADD COLUMN IF NOT EXISTS modo text NOT NULL DEFAULT 'rediseno';

-- Paso 2: Agregar CHECK constraint
ALTER TABLE solicitudes
ADD CONSTRAINT solicitudes_modo_check
CHECK (modo IN ('rediseno', 'diseno'));
