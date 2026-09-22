-- SEO-003. Review the alias mapping output before applying this script to a live database.
-- The transaction preserves every article and its published state. VI and EN are independent.
BEGIN;

LOCK TABLE public.cic_news, public.cic_news_en IN ACCESS EXCLUSIVE MODE;

CREATE TEMP TABLE seo_news_before ON COMMIT DROP AS
SELECT 'vi'::text locale, count(*) total, count(*) FILTER (WHERE published IS TRUE) published
FROM public.cic_news
UNION ALL
SELECT 'en', count(*), count(*) FILTER (WHERE published IS TRUE)
FROM public.cic_news_en;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.cic_news WHERE alias IS NULL OR btrim(alias) = '')
    OR EXISTS (SELECT 1 FROM public.cic_news_en WHERE alias IS NULL OR btrim(alias) = '') THEN
    RAISE EXCEPTION 'News alias cleanup requires a separate blank-alias policy';
  END IF;
END $$;

CREATE TEMP TABLE seo_news_alias_mapping (
  locale text NOT NULL,
  article_id integer NOT NULL,
  title text,
  old_alias text NOT NULL,
  new_alias text NOT NULL,
  canonical boolean NOT NULL,
  reason text NOT NULL,
  PRIMARY KEY (locale, article_id)
) ON COMMIT DROP;

INSERT INTO seo_news_alias_mapping
WITH all_rows AS (
  SELECT 'vi'::text locale, id, title, alias, published, start_time, created_time FROM public.cic_news
  UNION ALL
  SELECT 'en', id, title, alias, published, start_time, created_time FROM public.cic_news_en
), ranked AS (
  SELECT *, row_number() OVER (
    PARTITION BY locale, lower(btrim(alias))
    ORDER BY published DESC NULLS LAST, coalesce(start_time, created_time) DESC NULLS LAST, id DESC
  ) AS position,
  count(*) OVER (PARTITION BY locale, lower(btrim(alias))) AS group_size
  FROM all_rows
)
SELECT locale, id, title, alias, alias, position = 1,
  CASE WHEN position = 1 THEN 'canonical: published, latest start_time/created_time, highest id'
       ELSE 'non-canonical: alias-id; article and published state retained' END
FROM ranked WHERE group_size > 1;

-- Work on non-canonical rows in ID order. Occupied targets receive deterministic -2, -3... suffixes.
DO $$
DECLARE r record; candidate text; suffix integer; target_table regclass; occupied boolean;
BEGIN
  FOR r IN SELECT locale, article_id, old_alias FROM seo_news_alias_mapping
           WHERE NOT canonical ORDER BY locale, article_id LOOP
    target_table := CASE WHEN r.locale = 'en' THEN 'public.cic_news_en'::regclass
                         ELSE 'public.cic_news'::regclass END;
    suffix := 1;
    LOOP
      candidate := left(lower(btrim(r.old_alias)), 255 - length('-' || r.article_id::text ||
        CASE WHEN suffix = 1 THEN '' ELSE '-' || suffix::text END)) ||
        '-' || r.article_id::text || CASE WHEN suffix = 1 THEN '' ELSE '-' || suffix::text END;
      EXECUTE format('SELECT EXISTS (SELECT 1 FROM %s WHERE id <> $1 AND lower(btrim(alias)) = $2)', target_table)
        INTO occupied USING r.article_id, candidate;
      EXIT WHEN NOT occupied AND NOT EXISTS (
        SELECT 1 FROM seo_news_alias_mapping m
        WHERE m.locale = r.locale AND m.article_id <> r.article_id
          AND lower(btrim(m.new_alias)) = candidate
      );
      suffix := suffix + 1;
      IF suffix > 10000 THEN RAISE EXCEPTION 'Could not resolve News alias collision for %', r.article_id; END IF;
    END LOOP;
    UPDATE seo_news_alias_mapping SET new_alias = candidate
    WHERE locale = r.locale AND article_id = r.article_id;
  END LOOP;
END $$;

SELECT locale, article_id, title, old_alias, new_alias, canonical, reason
FROM seo_news_alias_mapping ORDER BY locale, old_alias, canonical DESC, article_id;

UPDATE public.cic_news n SET alias = m.new_alias
FROM seo_news_alias_mapping m
WHERE m.locale = 'vi' AND NOT m.canonical AND n.id = m.article_id;
UPDATE public.cic_news_en n SET alias = m.new_alias
FROM seo_news_alias_mapping m
WHERE m.locale = 'en' AND NOT m.canonical AND n.id = m.article_id;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.cic_news GROUP BY lower(btrim(alias)) HAVING count(*) > 1)
    OR EXISTS (SELECT 1 FROM public.cic_news_en GROUP BY lower(btrim(alias)) HAVING count(*) > 1) THEN
    RAISE EXCEPTION 'News normalized duplicate alias remains';
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS ux_cic_news_alias_norm ON public.cic_news (lower(btrim(alias)))
WHERE alias IS NOT NULL AND btrim(alias) <> '';
CREATE UNIQUE INDEX IF NOT EXISTS ux_cic_news_en_alias_norm ON public.cic_news_en (lower(btrim(alias)))
WHERE alias IS NOT NULL AND btrim(alias) <> '';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'public.cic_news'::regclass
                 AND conname = 'ck_cic_news_alias_nonblank') THEN
    ALTER TABLE public.cic_news ADD CONSTRAINT ck_cic_news_alias_nonblank
      CHECK (alias IS NOT NULL AND btrim(alias) <> '') NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'public.cic_news_en'::regclass
                 AND conname = 'ck_cic_news_en_alias_nonblank') THEN
    ALTER TABLE public.cic_news_en ADD CONSTRAINT ck_cic_news_en_alias_nonblank
      CHECK (alias IS NOT NULL AND btrim(alias) <> '') NOT VALID;
  END IF;
END $$;
ALTER TABLE public.cic_news VALIDATE CONSTRAINT ck_cic_news_alias_nonblank;
ALTER TABLE public.cic_news_en VALIDATE CONSTRAINT ck_cic_news_en_alias_nonblank;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM seo_news_before b
    WHERE (CASE WHEN b.locale = 'vi' THEN (SELECT count(*) FROM public.cic_news)
                ELSE (SELECT count(*) FROM public.cic_news_en) END) <> b.total
       OR (CASE WHEN b.locale = 'vi' THEN (SELECT count(*) FROM public.cic_news WHERE published IS TRUE)
                ELSE (SELECT count(*) FROM public.cic_news_en WHERE published IS TRUE) END) <> b.published
  ) THEN RAISE EXCEPTION 'News article count or published state changed'; END IF;
END $$;

COMMIT;
