BEGIN;

SELECT pg_advisory_xact_lock(hashtextextended('cic:events:hardening', 0));

-- 1. Chuẩn hoá dữ liệu thời gian kết thúc legacy (nếu end_time <= time_event thì cộng thêm 2 giờ cho đúng logic sự kiện)
UPDATE public.cic_event
SET end_time = time_event + INTERVAL '2 hours'
WHERE time_event IS NOT NULL AND (end_time IS NULL OR end_time <= time_event);

UPDATE public.cic_event_en
SET end_time = time_event + INTERVAL '2 hours'
WHERE time_event IS NOT NULL AND (end_time IS NULL OR end_time <= time_event);

-- 2. Chuẩn hoá chính sách Sự kiện nổi bật (Chỉ giữ TOP 1 sự kiện mới nhất cho mỗi nhóm VI và EN)
WITH ranked_vi AS (
  SELECT id,
         ROW_NUMBER() OVER (
           ORDER BY (published = true) DESC,
                    COALESCE(time_event, created_time, updated_time) DESC,
                    id DESC
         ) AS rank
  FROM public.cic_event
  WHERE is_hot = true
)
UPDATE public.cic_event
SET is_hot = false
WHERE id IN (
  SELECT id FROM ranked_vi WHERE rank > 1
);

WITH ranked_en AS (
  SELECT id,
         ROW_NUMBER() OVER (
           ORDER BY (published = true) DESC,
                    COALESCE(time_event, created_time, updated_time) DESC,
                    id DESC
         ) AS rank
  FROM public.cic_event_en
  WHERE is_hot = true
)
UPDATE public.cic_event_en
SET is_hot = false
WHERE id IN (
  SELECT id FROM ranked_en WHERE rank > 1
);

-- 3. Ràng buộc thời gian kết thúc hợp lệ
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.cic_event'::regclass
      AND conname = 'ck_cic_event_end_after_start'
  ) THEN
    ALTER TABLE public.cic_event
      ADD CONSTRAINT ck_cic_event_end_after_start
      CHECK (end_time IS NULL OR time_event IS NULL OR end_time > time_event) NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.cic_event_en'::regclass
      AND conname = 'ck_cic_event_en_end_after_start'
  ) THEN
    ALTER TABLE public.cic_event_en
      ADD CONSTRAINT ck_cic_event_en_end_after_start
      CHECK (end_time IS NULL OR time_event IS NULL OR end_time > time_event) NOT VALID;
  END IF;
END $$;

ALTER TABLE public.cic_event
  VALIDATE CONSTRAINT ck_cic_event_end_after_start;
ALTER TABLE public.cic_event_en
  VALIDATE CONSTRAINT ck_cic_event_en_end_after_start;

-- 4. Ràng buộc alias không được để trống
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.cic_event'::regclass
      AND conname = 'ck_cic_event_alias_nonblank'
  ) THEN
    ALTER TABLE public.cic_event
      ADD CONSTRAINT ck_cic_event_alias_nonblank
      CHECK (alias IS NOT NULL AND btrim(alias) <> '') NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.cic_event_en'::regclass
      AND conname = 'ck_cic_event_en_alias_nonblank'
  ) THEN
    ALTER TABLE public.cic_event_en
      ADD CONSTRAINT ck_cic_event_en_alias_nonblank
      CHECK (alias IS NOT NULL AND btrim(alias) <> '') NOT VALID;
  END IF;
END $$;

ALTER TABLE public.cic_event
  VALIDATE CONSTRAINT ck_cic_event_alias_nonblank;
ALTER TABLE public.cic_event_en
  VALIDATE CONSTRAINT ck_cic_event_en_alias_nonblank;

-- 5. Unique index cho alias chuẩn hóa (case-insensitive, trimmed)
CREATE UNIQUE INDEX IF NOT EXISTS ux_cic_event_alias_norm
  ON public.cic_event (lower(btrim(alias)))
  WHERE alias IS NOT NULL AND btrim(alias) <> '';

CREATE UNIQUE INDEX IF NOT EXISTS ux_cic_event_en_alias_norm
  ON public.cic_event_en (lower(btrim(alias)))
  WHERE alias IS NOT NULL AND btrim(alias) <> '';

-- 6. Đồng bộ sequence ID tránh lỗi duplicate key khi insert mới
SELECT setval(
  pg_get_serial_sequence('public.cic_event', 'id'),
  greatest(coalesce((SELECT max(id) FROM public.cic_event), 0), 1),
  (SELECT count(*) > 0 FROM public.cic_event)
);

SELECT setval(
  pg_get_serial_sequence('public.cic_event_en', 'id'),
  greatest(coalesce((SELECT max(id) FROM public.cic_event_en), 0), 1),
  (SELECT count(*) > 0 FROM public.cic_event_en)
);

COMMIT;
