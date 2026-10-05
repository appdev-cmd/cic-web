-- Migration: 20261005_reconcile_featured_products.sql
-- Mục đích: Giới hạn số lượng sản phẩm nổi bật tối đa 6 theo đúng chính sách FEATURED_CONTENT_LIMITS.product (6/6),
-- giữ lại 6 sản phẩm nổi bật có thời gian cập nhật gần nhất.

WITH top_6_vi AS (
  SELECT id FROM cic_products
  WHERE is_hot = true
  ORDER BY coalesce(edited_time, created_time) DESC NULLS LAST, id DESC
  LIMIT 6
)
UPDATE cic_products
SET is_hot = false
WHERE is_hot = true AND id NOT IN (SELECT id FROM top_6_vi);

WITH top_6_en AS (
  SELECT id FROM cic_products_en
  WHERE is_hot = true
  ORDER BY coalesce(edited_time, created_time) DESC NULLS LAST, id DESC
  LIMIT 6
)
UPDATE cic_products_en
SET is_hot = false
WHERE is_hot = true AND id NOT IN (SELECT id FROM top_6_en);
