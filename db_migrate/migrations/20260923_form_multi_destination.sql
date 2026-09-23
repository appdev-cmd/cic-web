-- Migration: 20260923_form_multi_destination.sql
-- Description: Multi-Destination foundation for Dynamic Forms (Google Sheets, Email, etc.)
-- Includes cic_form_destinations, cic_form_submission_deliveries and backfill of legacy email settings.

BEGIN;

SELECT pg_advisory_xact_lock(hashtext('cic_form_multi_destination_foundation'));

-- 1. Table cic_form_destinations
-- Supports 0..N external destinations per form (e.g. multiple Google Sheets, multiple Email notification targets).
CREATE TABLE IF NOT EXISTS cic_form_destinations (
  id BIGSERIAL PRIMARY KEY,
  form_id BIGINT NOT NULL REFERENCES cic_forms(id) ON DELETE CASCADE,
  destination_type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL DEFAULT '',
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_cic_form_destinations_form_id 
  ON cic_form_destinations (form_id);

CREATE INDEX IF NOT EXISTS idx_cic_form_destinations_active 
  ON cic_form_destinations (form_id, destination_type, is_enabled) 
  WHERE deleted_at IS NULL;

-- 2. Table cic_form_submission_deliveries
-- Delivery audit tracking for each destination attempt.
CREATE TABLE IF NOT EXISTS cic_form_submission_deliveries (
  id BIGSERIAL PRIMARY KEY,
  submission_id BIGINT NOT NULL REFERENCES cic_form_submissions(id) ON DELETE CASCADE,
  destination_id BIGINT NOT NULL REFERENCES cic_form_destinations(id) ON DELETE CASCADE,
  destination_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'failed')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT NULL,
  response_metadata JSONB NULL,
  idempotency_key VARCHAR(255) NULL,
  last_attempt_at TIMESTAMPTZ NULL,
  delivered_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_cic_form_submission_deliveries_sub_dest UNIQUE (submission_id, destination_id)
);

CREATE INDEX IF NOT EXISTS idx_cic_form_submission_deliveries_sub 
  ON cic_form_submission_deliveries (submission_id);

CREATE INDEX IF NOT EXISTS idx_cic_form_submission_deliveries_dest 
  ON cic_form_submission_deliveries (destination_id);

CREATE INDEX IF NOT EXISTS idx_cic_form_submission_deliveries_status 
  ON cic_form_submission_deliveries (status);

-- 3. Idempotent Backfill: Migrate legacy email configuration to cic_form_destinations
-- Migrates existing forms that have send_admin_email or send_confirmation_email enabled
-- into an active 'email' destination record.
INSERT INTO cic_form_destinations (
  form_id,
  destination_type,
  name,
  is_enabled,
  config,
  created_at,
  updated_at
)
SELECT 
  f.id AS form_id,
  'email' AS destination_type,
  'Thông báo Email' AS name,
  true AS is_enabled,
  jsonb_build_object(
    'sendAdminEmail', f.send_admin_email,
    'adminEmails', COALESCE(to_jsonb(f.admin_emails), '[]'::jsonb),
    'adminEmailTemplateId', CASE WHEN f.admin_email_template_id IS NOT NULL THEN f.admin_email_template_id::text ELSE null END,
    'sendConfirmationEmail', f.send_confirmation_email,
    'confirmationEmailTemplateId', CASE WHEN f.confirmation_email_template_id IS NOT NULL THEN f.confirmation_email_template_id::text ELSE null END
  ) AS config,
  NOW() AS created_at,
  NOW() AS updated_at
FROM cic_forms f
WHERE f.deleted_at IS NULL
  AND (f.send_admin_email = true OR f.send_confirmation_email = true)
  AND NOT EXISTS (
    SELECT 1 FROM cic_form_destinations d
    WHERE d.form_id = f.id AND d.destination_type = 'email' AND d.deleted_at IS NULL
  );

COMMIT;
