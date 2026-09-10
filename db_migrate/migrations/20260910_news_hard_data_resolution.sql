BEGIN;

-- Serialize this one-time normalization with future News writes using the same lock namespace.
SELECT pg_advisory_xact_lock(hashtextextended('cic:news:hard-data-resolution', 0));

CREATE TEMP TABLE news_migration_before ON COMMIT DROP AS
SELECT 'vi'::text locale, count(*)::bigint total,
       count(*) FILTER (WHERE published IS TRUE)::bigint published,
       count(*) FILTER (WHERE is_hot IS TRUE)::bigint hot,
       count(*) FILTER (WHERE show_in_homepage IS TRUE)::bigint home
FROM public.cic_news
UNION ALL
SELECT 'en', count(*), count(*) FILTER (WHERE published IS TRUE),
       count(*) FILTER (WHERE is_hot IS TRUE),
       count(*) FILTER (WHERE show_in_homepage IS TRUE)
FROM public.cic_news_en;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.cic_news WHERE alias IS NULL OR btrim(alias) = '')
     OR EXISTS (SELECT 1 FROM public.cic_news_en WHERE alias IS NULL OR btrim(alias) = '') THEN
    RAISE EXCEPTION 'News alias normalization aborted: NULL/blank aliases require an explicit policy.';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.cic_news'::regclass AND conname='ck_cic_news_alias_nonblank') THEN
    ALTER TABLE public.cic_news ADD CONSTRAINT ck_cic_news_alias_nonblank
      CHECK (alias IS NOT NULL AND btrim(alias)<>'') NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='public.cic_news_en'::regclass AND conname='ck_cic_news_en_alias_nonblank') THEN
    ALTER TABLE public.cic_news_en ADD CONSTRAINT ck_cic_news_en_alias_nonblank
      CHECK (alias IS NOT NULL AND btrim(alias)<>'') NOT VALID;
  END IF;
END $$;
ALTER TABLE public.cic_news VALIDATE CONSTRAINT ck_cic_news_alias_nonblank;
ALTER TABLE public.cic_news_en VALIDATE CONSTRAINT ck_cic_news_en_alias_nonblank;

CREATE TEMP TABLE news_alias_report (
  locale text NOT NULL,
  article_id integer NOT NULL,
  title text,
  old_alias text NOT NULL,
  new_alias text NOT NULL,
  canonical boolean NOT NULL,
  reason text NOT NULL
) ON COMMIT DROP;

INSERT INTO news_alias_report
WITH ranked AS (
  SELECT 'vi'::text locale,id,title,alias,published,start_time,created_time,updated_time,
         row_number() OVER (
           PARTITION BY lower(btrim(alias))
           ORDER BY published DESC NULLS LAST,
                    coalesce(start_time,created_time,updated_time,'-infinity'::timestamptz) DESC,
                    id DESC
         ) rank,
         count(*) OVER (PARTITION BY lower(btrim(alias))) group_size
  FROM public.cic_news
  UNION ALL
  SELECT 'en',id,title,alias,published,start_time,created_time,updated_time,
         row_number() OVER (
           PARTITION BY lower(btrim(alias))
           ORDER BY published DESC NULLS LAST,
                    coalesce(start_time,created_time,updated_time,'-infinity'::timestamptz) DESC,
                    id DESC
         ),
         count(*) OVER (PARTITION BY lower(btrim(alias)))
  FROM public.cic_news_en
)
SELECT locale,id,title,alias,
       CASE WHEN rank = 1 THEN lower(btrim(alias))
            ELSE left(lower(btrim(alias)),255-length('-'||id::text))||'-'||id::text END,
       rank = 1,
       CASE WHEN rank = 1
            THEN 'canonical: published, latest start_time/article date, highest id'
            ELSE 'non-canonical: deterministic alias-id suffix; article preserved' END
FROM ranked
WHERE group_size > 1;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM news_alias_report r
    JOIN public.cic_news n ON r.locale='vi' AND n.id<>r.article_id
      AND lower(btrim(n.alias))=lower(btrim(r.new_alias))
    WHERE NOT r.canonical
  ) OR EXISTS (
    SELECT 1 FROM news_alias_report r
    JOIN public.cic_news_en n ON r.locale='en' AND n.id<>r.article_id
      AND lower(btrim(n.alias))=lower(btrim(r.new_alias))
    WHERE NOT r.canonical
  ) THEN
    RAISE EXCEPTION 'News alias normalization aborted: deterministic alias-id target collides.';
  END IF;
END $$;

UPDATE public.cic_news n
SET alias=r.new_alias
FROM news_alias_report r
WHERE r.locale='vi' AND NOT r.canonical AND n.id=r.article_id AND n.alias IS DISTINCT FROM r.new_alias;

UPDATE public.cic_news_en n
SET alias=r.new_alias
FROM news_alias_report r
WHERE r.locale='en' AND NOT r.canonical AND n.id=r.article_id AND n.alias IS DISTINCT FROM r.new_alias;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.cic_news GROUP BY lower(btrim(alias)) HAVING count(*)>1)
     OR EXISTS (SELECT 1 FROM public.cic_news_en GROUP BY lower(btrim(alias)) HAVING count(*)>1) THEN
    RAISE EXCEPTION 'News alias normalization failed: duplicate normalized aliases remain.';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS ux_cic_news_alias_norm
  ON public.cic_news (lower(btrim(alias)))
  WHERE alias IS NOT NULL AND btrim(alias) <> '';

CREATE UNIQUE INDEX IF NOT EXISTS ux_cic_news_en_alias_norm
  ON public.cic_news_en (lower(btrim(alias)))
  WHERE alias IS NOT NULL AND btrim(alias) <> '';

CREATE TEMP TABLE news_placement_report (
  locale text NOT NULL,
  placement text NOT NULL,
  article_id integer NOT NULL,
  title text,
  old_flag boolean NOT NULL,
  new_flag boolean NOT NULL,
  rank integer NOT NULL,
  reason text NOT NULL
) ON COMMIT DROP;

INSERT INTO news_placement_report
WITH candidates AS (
  SELECT 'vi'::text locale,'hot'::text placement,id,title,is_hot old_flag,
         row_number() OVER (ORDER BY published DESC NULLS LAST,ordering ASC NULLS LAST,coalesce(start_time,created_time,updated_time,'-infinity'::timestamptz) DESC,id DESC)::integer rank
  FROM public.cic_news WHERE is_hot IS TRUE
  UNION ALL
  SELECT 'vi','home',id,title,show_in_homepage,
         row_number() OVER (ORDER BY published DESC NULLS LAST,ordering ASC NULLS LAST,coalesce(start_time,created_time,updated_time,'-infinity'::timestamptz) DESC,id DESC)::integer
  FROM public.cic_news WHERE show_in_homepage IS TRUE
  UNION ALL
  SELECT 'en','hot',id,title,is_hot,
         row_number() OVER (ORDER BY published DESC NULLS LAST,ordering ASC NULLS LAST,coalesce(start_time,created_time,updated_time,'-infinity'::timestamptz) DESC,id DESC)::integer
  FROM public.cic_news_en WHERE is_hot IS TRUE
  UNION ALL
  SELECT 'en','home',id,title,show_in_homepage,
         row_number() OVER (ORDER BY published DESC NULLS LAST,ordering ASC NULLS LAST,coalesce(start_time,created_time,updated_time,'-infinity'::timestamptz) DESC,id DESC)::integer
  FROM public.cic_news_en WHERE show_in_homepage IS TRUE
)
SELECT locale,placement,id,title,old_flag,rank<=4,rank,
       CASE WHEN rank<=4
            THEN 'kept: published, lower ordering, latest start_time/article date, highest id'
            ELSE 'overflow: placement flag disabled only; article and published status preserved' END
FROM candidates;

UPDATE public.cic_news n SET is_hot=false
FROM news_placement_report r
WHERE r.locale='vi' AND r.placement='hot' AND NOT r.new_flag AND n.id=r.article_id AND n.is_hot IS TRUE;
UPDATE public.cic_news n SET show_in_homepage=false
FROM news_placement_report r
WHERE r.locale='vi' AND r.placement='home' AND NOT r.new_flag AND n.id=r.article_id AND n.show_in_homepage IS TRUE;
UPDATE public.cic_news_en n SET is_hot=false
FROM news_placement_report r
WHERE r.locale='en' AND r.placement='hot' AND NOT r.new_flag AND n.id=r.article_id AND n.is_hot IS TRUE;
UPDATE public.cic_news_en n SET show_in_homepage=false
FROM news_placement_report r
WHERE r.locale='en' AND r.placement='home' AND NOT r.new_flag AND n.id=r.article_id AND n.show_in_homepage IS TRUE;

CREATE OR REPLACE FUNCTION public.cic_enforce_news_placement_limit()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  enabled_count integer;
BEGIN
  IF NEW.is_hot IS TRUE THEN
    PERFORM pg_advisory_xact_lock(hashtextextended(TG_TABLE_NAME||':is_hot',0));
    EXECUTE format('SELECT count(*) FROM public.%I WHERE is_hot IS TRUE AND id<>$1',TG_TABLE_NAME)
      INTO enabled_count USING coalesce(NEW.id,-1);
    IF enabled_count >= 4 THEN
      RAISE EXCEPTION '% supports at most 4 Hot News articles',TG_TABLE_NAME USING ERRCODE='check_violation';
    END IF;
  END IF;
  IF NEW.show_in_homepage IS TRUE THEN
    PERFORM pg_advisory_xact_lock(hashtextextended(TG_TABLE_NAME||':show_in_homepage',0));
    EXECUTE format('SELECT count(*) FROM public.%I WHERE show_in_homepage IS TRUE AND id<>$1',TG_TABLE_NAME)
      INTO enabled_count USING coalesce(NEW.id,-1);
    IF enabled_count >= 4 THEN
      RAISE EXCEPTION '% supports at most 4 Home News articles',TG_TABLE_NAME USING ERRCODE='check_violation';
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_cic_news_placement_limit ON public.cic_news;
CREATE TRIGGER trg_cic_news_placement_limit
BEFORE INSERT OR UPDATE OF is_hot,show_in_homepage,published ON public.cic_news
FOR EACH ROW EXECUTE FUNCTION public.cic_enforce_news_placement_limit();

DROP TRIGGER IF EXISTS trg_cic_news_en_placement_limit ON public.cic_news_en;
CREATE TRIGGER trg_cic_news_en_placement_limit
BEFORE INSERT OR UPDATE OF is_hot,show_in_homepage,published ON public.cic_news_en
FOR EACH ROW EXECUTE FUNCTION public.cic_enforce_news_placement_limit();

DO $$
DECLARE before_total bigint; after_total bigint; before_published bigint; after_published bigint;
BEGIN
  SELECT sum(total),sum(published) INTO before_total,before_published FROM news_migration_before;
  SELECT (SELECT count(*) FROM public.cic_news)+(SELECT count(*) FROM public.cic_news_en),
         (SELECT count(*) FROM public.cic_news WHERE published IS TRUE)+(SELECT count(*) FROM public.cic_news_en WHERE published IS TRUE)
    INTO after_total,after_published;
  IF before_total<>after_total OR before_published<>after_published THEN
    RAISE EXCEPTION 'News data preservation check failed.';
  END IF;
  IF (SELECT count(*) FROM public.cic_news WHERE is_hot IS TRUE)>4
     OR (SELECT count(*) FROM public.cic_news WHERE show_in_homepage IS TRUE)>4
     OR (SELECT count(*) FROM public.cic_news_en WHERE is_hot IS TRUE)>4
     OR (SELECT count(*) FROM public.cic_news_en WHERE show_in_homepage IS TRUE)>4 THEN
    RAISE EXCEPTION 'News placement cleanup failed.';
  END IF;
END $$;

SELECT locale,article_id,title,old_alias,new_alias,canonical,reason
FROM news_alias_report ORDER BY locale,old_alias,canonical DESC,article_id;
SELECT locale,placement,article_id,title,old_flag,new_flag,rank,reason
FROM news_placement_report ORDER BY locale,placement,rank;
SELECT * FROM news_migration_before ORDER BY locale;
SELECT 'vi' locale,count(*) total,count(*) FILTER(WHERE published IS TRUE) published,
       count(*) FILTER(WHERE is_hot IS TRUE) hot,count(*) FILTER(WHERE show_in_homepage IS TRUE) home
FROM public.cic_news
UNION ALL
SELECT 'en',count(*),count(*) FILTER(WHERE published IS TRUE),
       count(*) FILTER(WHERE is_hot IS TRUE),count(*) FILTER(WHERE show_in_homepage IS TRUE)
FROM public.cic_news_en ORDER BY locale;

COMMIT;
