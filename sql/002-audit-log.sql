-- ============================================================================
-- Migration: Create audit_log table for admin action tracking
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  solicitud_id uuid REFERENCES solicitudes(id) ON DELETE CASCADE,
  accion text NOT NULL,
  detalle jsonb DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_audit_solicitud ON audit_log(solicitud_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);

-- RLS: only service_role can insert (bypasses RLS by default)
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
