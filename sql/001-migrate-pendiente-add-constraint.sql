-- ============================================================================
-- Migration: Convert legacy "pendiente" records and add estado constraint
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ============================================================================

-- 1. Migrate existing "pendiente" records to "generando"
UPDATE solicitudes
SET estado = 'generando',
    notas_admin = COALESCE(notas_admin, '') || ' [Migrado desde pendiente]'
WHERE estado = 'pendiente';

-- 2. Add CHECK constraint to prevent invalid estados
ALTER TABLE solicitudes
DROP CONSTRAINT IF EXISTS solicitudes_estado_check;

ALTER TABLE solicitudes
ADD CONSTRAINT solicitudes_estado_check
CHECK (estado IN ('generando', 'revision', 'aprobada', 'enviada', 'error'));

-- 3. Add updated_at trigger (if not exists) for recovery detection
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON solicitudes;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON solicitudes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 4. Enable RLS on solicitudes table
ALTER TABLE solicitudes ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policy: Allow anonymous reads for the public form (INSERT only)
CREATE POLICY "Allow anonymous insert" ON solicitudes
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 6. RLS Policy: Service role has full access (used by supabaseAdmin)
-- The service_role key bypasses RLS by default, so no explicit policy needed.

-- 7. Verify
SELECT estado, COUNT(*) FROM solicitudes GROUP BY estado ORDER BY estado;
