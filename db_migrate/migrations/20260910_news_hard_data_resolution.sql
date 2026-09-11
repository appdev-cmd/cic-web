BEGIN;

-- Serialize this one-time normalization with future News writes using the same lock namespace.
SELECT pg_advisory_xact_lock(hashtextextended('cic:news:hard-data-resolution', 0));

-- 1. Snapshot counts, placement state, and content checksums before migration
CREATE TEMP TABLE news_migration_before ON COMMIT DROP AS
SELECT 'vi'::text locale,
       count(*)::bigint total,
       count(*) FILTER (WHERE published IS TRUE)::bigint published,
       count(*) FILTER (WHERE is_hot IS TRUE)::bigint hot,
       count(*) FILTER (WHERE show_in_homepage IS TRUE)::bigint home,
       coalesce(sum(hashtext(id::text || coalesce(alias,'') || coalesce(title,'') || coalesce(content,'') || published::text || coalesce(start_time::text,''))), 0)::bigint AS content_checksum
FROM public.cic_news
UNION ALL
SELECT 'en',
       count(*)::bigint total,
       count(*) FILTER (WHERE published IS TRUE)::bigint published,
       count(*) FILTER (WHERE is_hot IS TRUE)::bigint hot,
       count(*) FILTER (WHERE show_in_homepage IS TRUE)::bigint home,
       coalesce(sum(hashtext(id::text || coalesce(alias,'') || coalesce(title,'') || coalesce(content,'') || published::text || coalesce(start_time::text,''))), 0)::bigint AS content_checksum
FROM public.cic_news_en;

-- 2. Drop unique alias indexes if they were previously created; legacy aliases remain 100% UNCHANGED
DROP INDEX IF EXISTS public.ux_cic_news_alias_norm;
DROP INDEX IF EXISTS public.ux_cic_news_en_alias_norm;

-- 3. Standardize Hot News and Homepage placement
-- Legacy `ordering` is strictly ignored because historical ordering values are unreliable.
-- Candidates are evaluated strictly from records currently having the respective flag enabled.
-- Deterministic ranking:
--   1. published = true first (published DESC NULLS LAST)
--   2. Latest article date: COALESCE(start_time, created_time, updated_time) DESC
--   3. Tie breaker: id DESC
-- The TOP 4 are kept. For all remaining candidates, only the placement flag is turned off.
CREATE TEMP TABLE news_placement_report (
  locale text NOT NULL,
  placement text NOT NULL,
  article_id integer NOT NULL,
  title text,
  old_flag boolean NOT NULL,
  new_flag boolean NOT NULL,
  rank integer NOT NULL,
  article_date timestamptz,
  reason text NOT NULL
) ON COMMIT DROP;

INSERT INTO news_placement_report
WITH candidates AS (
  SELECT 'vi'::text locale, 'hot'::text placement, id, title, is_hot AS old_flag,
         coalesce(start_time, created_time, updated_time) AS article_date,
         row_number() OVER (
           ORDER BY published DESC NULLS LAST,
                    coalesce(start_time, created_time, updated_time, '-infinity'::timestamptz) DESC,
                    id DESC
         )::integer AS rank
  FROM public.cic_news
  WHERE is_hot IS TRUE
  UNION ALL
  SELECT 'vi', 'home', id, title, show_in_homepage,
         coalesce(start_time, created_time, updated_time),
         row_number() OVER (
           ORDER BY published DESC NULLS LAST,
                    coalesce(start_time, created_time, updated_time, '-infinity'::timestamptz) DESC,
                    id DESC
         )::integer
  FROM public.cic_news
  WHERE show_in_homepage IS TRUE
  UNION ALL
  SELECT 'en', 'hot', id, title, is_hot,
         coalesce(start_time, created_time, updated_time),
         row_number() OVER (
           ORDER BY published DESC NULLS LAST,
                    coalesce(start_time, created_time, updated_time, '-infinity'::timestamptz) DESC,
                    id DESC
         )::integer
  FROM public.cic_news_en
  WHERE is_hot IS TRUE
  UNION ALL
  SELECT 'en', 'home', id, title, show_in_homepage,
         coalesce(start_time, created_time, updated_time),
         row_number() OVER (
           ORDER BY published DESC NULLS LAST,
                    coalesce(start_time, created_time, updated_time, '-infinity'::timestamptz) DESC,
                    id DESC
         )::integer
  FROM public.cic_news_en
  WHERE show_in_homepage IS TRUE
)
SELECT locale, placement, id, title, old_flag, (rank <= 4) AS new_flag, rank, article_date,
       CASE WHEN rank <= 4
            THEN 'kept: published, latest article date (start/created/updated), highest id'
            ELSE 'overflow: placement flag disabled only; article, content, and published status preserved'
       END
FROM candidates;

-- Disable placement flag only for overflow records (rank > 4)
UPDATE public.cic_news n
SET is_hot = false
FROM news_placement_report r
WHERE r.locale = 'vi' AND r.placement = 'hot' AND NOT r.new_flag AND n.id = r.article_id AND n.is_hot IS TRUE;

UPDATE public.cic_news n
SET show_in_homepage = false
FROM news_placement_report r
WHERE r.locale = 'vi' AND r.placement = 'home' AND NOT r.new_flag AND n.id = r.article_id AND n.show_in_homepage IS TRUE;

UPDATE public.cic_news_en n
SET is_hot = false
FROM news_placement_report r
WHERE r.locale = 'en' AND r.placement = 'hot' AND NOT r.new_flag AND n.id = r.article_id AND n.is_hot IS TRUE;

UPDATE public.cic_news_en n
SET show_in_homepage = false
FROM news_placement_report r
WHERE r.locale = 'en' AND r.placement = 'home' AND NOT r.new_flag AND n.id = r.article_id AND n.show_in_homepage IS TRUE;

-- 4. Resynchronize primary key sequences using dynamic sequence discovery
SELECT setval(pg_get_serial_sequence('public.cic_news', 'id'), coalesce((SELECT max(id) FROM public.cic_news), 1), true);
SELECT setval(pg_get_serial_sequence('public.cic_news_en', 'id'), coalesce((SELECT max(id) FROM public.cic_news_en), 1), true);

-- 5. Safety Net: Enforce maximum 4 Hot and 4 Home articles per table via trigger
CREATE OR REPLACE FUNCTION public.cic_enforce_news_placement_limit()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  enabled_count integer;
BEGIN
  IF NEW.is_hot IS TRUE THEN
    PERFORM pg_advisory_xact_lock(hashtextextended(TG_TABLE_NAME||':is_hot', 0));
    EXECUTE format('SELECT count(*) FROM public.%I WHERE is_hot IS TRUE AND id <> $1', TG_TABLE_NAME)
      INTO enabled_count USING coalesce(NEW.id, -1);
    IF enabled_count >= 4 THEN
      RAISE EXCEPTION '% supports at most 4 Hot News articles', TG_TABLE_NAME USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  IF NEW.show_in_homepage IS TRUE THEN
    PERFORM pg_advisory_xact_lock(hashtextextended(TG_TABLE_NAME||':show_in_homepage', 0));
    EXECUTE format('SELECT count(*) FROM public.%I WHERE show_in_homepage IS TRUE AND id <> $1', TG_TABLE_NAME)
      INTO enabled_count USING coalesce(NEW.id, -1);
    IF enabled_count >= 4 THEN
      RAISE EXCEPTION '% supports at most 4 Home News articles', TG_TABLE_NAME USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_cic_news_placement_limit ON public.cic_news;
CREATE TRIGGER trg_cic_news_placement_limit
BEFORE INSERT OR UPDATE OF is_hot, show_in_homepage, published ON public.cic_news
FOR EACH ROW EXECUTE FUNCTION public.cic_enforce_news_placement_limit();

DROP TRIGGER IF EXISTS trg_cic_news_en_placement_limit ON public.cic_news_en;
CREATE TRIGGER trg_cic_news_en_placement_limit
BEFORE INSERT OR UPDATE OF is_hot, show_in_homepage, published ON public.cic_news_en
FOR EACH ROW EXECUTE FUNCTION public.cic_enforce_news_placement_limit();

-- 6. Production Safety Assertions: Rollback immediately if any check fails
DO $$
DECLARE
  before_rec RECORD;
  vi_after_total bigint;
  vi_after_published bigint;
  vi_after_checksum bigint;
  vi_hot_count bigint;
  vi_home_count bigint;
  en_after_total bigint;
  en_after_published bigint;
  en_after_checksum bigint;
  en_hot_count bigint;
  en_home_count bigint;
  seq_vi_val bigint;
  seq_en_val bigint;
  max_vi_id bigint;
  max_en_id bigint;
BEGIN
  -- Assert VI data integrity
  SELECT total, published, content_checksum INTO before_rec FROM news_migration_before WHERE locale = 'vi';
  SELECT count(*), count(*) FILTER (WHERE published IS TRUE),
         count(*) FILTER (WHERE is_hot IS TRUE), count(*) FILTER (WHERE show_in_homepage IS TRUE),
         coalesce(sum(hashtext(id::text || coalesce(alias,'') || coalesce(title,'') || coalesce(content,'') || published::text || coalesce(start_time::text,''))), 0)
    INTO vi_after_total, vi_after_published, vi_hot_count, vi_home_count, vi_after_checksum
  FROM public.cic_news;

  IF before_rec.total <> vi_after_total THEN
    RAISE EXCEPTION 'VI total news count changed from % to % (unexpected record deletion/insertion)', before_rec.total, vi_after_total;
  END IF;
  IF before_rec.published <> vi_after_published THEN
    RAISE EXCEPTION 'VI published count changed from % to % (unexpected published state modification)', before_rec.published, vi_after_published;
  END IF;
  IF before_rec.content_checksum <> vi_after_checksum THEN
    RAISE EXCEPTION 'VI content/alias/date checksum mismatch (unexpected data mutation)';
  END IF;
  IF vi_hot_count > 4 THEN
    RAISE EXCEPTION 'VI hot news count is %, expected <= 4', vi_hot_count;
  END IF;
  IF vi_home_count > 4 THEN
    RAISE EXCEPTION 'VI homepage news count is %, expected <= 4', vi_home_count;
  END IF;

  -- Assert EN data integrity
  SELECT total, published, content_checksum INTO before_rec FROM news_migration_before WHERE locale = 'en';
  SELECT count(*), count(*) FILTER (WHERE published IS TRUE),
         count(*) FILTER (WHERE is_hot IS TRUE), count(*) FILTER (WHERE show_in_homepage IS TRUE),
         coalesce(sum(hashtext(id::text || coalesce(alias,'') || coalesce(title,'') || coalesce(content,'') || published::text || coalesce(start_time::text,''))), 0)
    INTO en_after_total, en_after_published, en_hot_count, en_home_count, en_after_checksum
  FROM public.cic_news_en;

  IF before_rec.total <> en_after_total THEN
    RAISE EXCEPTION 'EN total news count changed from % to % (unexpected record deletion/insertion)', before_rec.total, en_after_total;
  END IF;
  IF before_rec.published <> en_after_published THEN
    RAISE EXCEPTION 'EN published count changed from % to % (unexpected published state modification)', before_rec.published, en_after_published;
  END IF;
  IF before_rec.content_checksum <> en_after_checksum THEN
    RAISE EXCEPTION 'EN content/alias/date checksum mismatch (unexpected data mutation)';
  END IF;
  IF en_hot_count > 4 THEN
    RAISE EXCEPTION 'EN hot news count is %, expected <= 4', en_hot_count;
  END IF;
  IF en_home_count > 4 THEN
    RAISE EXCEPTION 'EN homepage news count is %, expected <= 4', en_home_count;
  END IF;

  -- Assert sequence synchronization
  SELECT coalesce(max(id), 0) INTO max_vi_id FROM public.cic_news;
  SELECT coalesce(max(id), 0) INTO max_en_id FROM public.cic_news_en;
  EXECUTE format('SELECT last_value FROM %s', pg_get_serial_sequence('public.cic_news', 'id')) INTO seq_vi_val;
  EXECUTE format('SELECT last_value FROM %s', pg_get_serial_sequence('public.cic_news_en', 'id')) INTO seq_en_val;

  IF seq_vi_val < max_vi_id THEN
    RAISE EXCEPTION 'VI sequence last_value (%) is lower than max(id) (%)', seq_vi_val, max_vi_id;
  END IF;
  IF seq_en_val < max_en_id THEN
    RAISE EXCEPTION 'EN sequence last_value (%) is lower than max(id) (%)', seq_en_val, max_en_id;
  END IF;
END $$;

-- 7. Diagnostic outputs for report generation
SELECT locale, placement, article_id, title, article_date, rank, reason
FROM news_placement_report
WHERE rank <= 4
ORDER BY locale, placement, rank;

SELECT * FROM news_migration_before ORDER BY locale;

SELECT 'vi' locale, count(*) total, count(*) FILTER(WHERE published IS TRUE) published,
       count(*) FILTER(WHERE is_hot IS TRUE) hot, count(*) FILTER(WHERE show_in_homepage IS TRUE) home
FROM public.cic_news
UNION ALL
SELECT 'en', count(*), count(*) FILTER(WHERE published IS TRUE),
       count(*) FILTER(WHERE is_hot IS TRUE), count(*) FILTER(WHERE show_in_homepage IS TRUE)
FROM public.cic_news_en ORDER BY locale;

SELECT 'vi' as locale, pg_get_serial_sequence('public.cic_news', 'id') as seq_name, max(id) as max_id FROM public.cic_news
UNION ALL
SELECT 'en', pg_get_serial_sequence('public.cic_news_en', 'id'), max(id) FROM public.cic_news_en;

COMMIT;
