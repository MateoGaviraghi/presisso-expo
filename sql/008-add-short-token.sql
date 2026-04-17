-- Migration: add short_token column to solicitudes for short PDF URLs
-- Fixes WhatsApp link wrapping issue (long Supabase URLs are not detected as clickable links)

ALTER TABLE solicitudes
  ADD COLUMN IF NOT EXISTS short_token TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_solicitudes_short_token
  ON solicitudes(short_token)
  WHERE short_token IS NOT NULL;

-- Backfill existing rows that have a pdf_url but no short_token
-- Uses substring(md5(random()::text || id::text), 1, 10) as a fallback token generator
-- (the app will regenerate proper nanoid tokens next time PDFs are regenerated)
UPDATE solicitudes
SET short_token = substring(md5(random()::text || id::text || clock_timestamp()::text), 1, 10)
WHERE pdf_url IS NOT NULL AND short_token IS NULL;
