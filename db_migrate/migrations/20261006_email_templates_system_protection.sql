-- 20261006_email_templates_system_protection.sql
-- Thêm cột is_system để đánh dấu các mẫu email hệ thống không được phép xóa

ALTER TABLE cic_email_templates 
ADD COLUMN IF NOT EXISTS is_system BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_cic_email_templates_is_system 
ON cic_email_templates(is_system);

-- Đánh dấu các mẫu email xác thực/hệ thống
UPDATE cic_email_templates 
SET is_system = TRUE 
WHERE event_key IN ('auth_activate', 'auth_forgot_password');
