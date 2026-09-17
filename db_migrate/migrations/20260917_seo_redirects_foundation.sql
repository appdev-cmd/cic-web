-- Migration: 20260917_seo_redirects_foundation.sql
-- Description: Create cic_redirects table for 301/302 URL redirects and SEO path mapping

BEGIN;

SELECT pg_advisory_xact_lock(hashtext('cic_seo_redirects_foundation'));

CREATE TABLE IF NOT EXISTS cic_redirects (
  id SERIAL PRIMARY KEY,
  source_path VARCHAR(500) NOT NULL,
  target_path VARCHAR(500) NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 301 CHECK (status_code IN (301, 302)),
  source VARCHAR(100) NOT NULL DEFAULT 'Thủ công',
  is_active BOOLEAN NOT NULL DEFAULT true,
  hit_count INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cic_redirects_source_path 
  ON cic_redirects (LOWER(TRIM(source_path)));

CREATE INDEX IF NOT EXISTS idx_cic_redirects_active 
  ON cic_redirects (is_active);

-- Seed standard initial redirects
INSERT INTO cic_redirects (source_path, target_path, status_code, source, is_active, note)
VALUES
  ('/san-pham-cu.html', '/products', 301, 'Legacy URL migration', true, 'Chuyển hướng trang sản phẩm cũ'),
  ('/about', '/gioi-thieu', 301, 'Chuẩn hóa slug', true, 'Chuyển hướng alias về slug tiếng Việt'),
  ('/tin-tuc-su-kien.html', '/news', 301, 'Legacy URL migration', true, 'Chuyển hướng trang tin tức cũ'),
  ('/lien-he.html', '/contact', 301, 'Legacy URL migration', true, 'Chuyển hướng trang liên hệ cũ')
ON CONFLICT (LOWER(TRIM(source_path))) DO NOTHING;

COMMIT;
