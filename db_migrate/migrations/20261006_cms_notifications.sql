-- Migration: CMS Notification Center Schema
-- Tables: cms_notifications, cms_notification_reads

CREATE TABLE IF NOT EXISTS cms_notifications (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'contact' | 'registration' | 'quote' | 'editorial' | 'system' | 'security'
    target_module VARCHAR(100), -- 'customer_requests', 'news', 'products', 'events', 'system' (đối chiếu RBAC)
    target_action VARCHAR(50) DEFAULT 'view', -- 'view' | 'edit'
    target_user_id BIGINT REFERENCES cic_users(id) ON DELETE CASCADE, -- NULL nếu broadcast theo quyền, hoặc ID tài khoản đích danh
    link_url TEXT, -- URL điều hướng khi click: ví dụ '/cms/customer-requests?id=123'
    metadata JSONB DEFAULT '{}'::jsonb, -- Thông tin thêm: { customer_name, email, phone, entity_id, ... }
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_notifications_module ON cms_notifications(target_module, target_action);
CREATE INDEX IF NOT EXISTS idx_cms_notifications_user ON cms_notifications(target_user_id);
CREATE INDEX IF NOT EXISTS idx_cms_notifications_created_at ON cms_notifications(created_at DESC);

CREATE TABLE IF NOT EXISTS cms_notification_reads (
    notification_id BIGINT NOT NULL REFERENCES cms_notifications(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES cic_users(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (notification_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_cms_notification_reads_user ON cms_notification_reads(user_id);
