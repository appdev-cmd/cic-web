BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS ux_cic_news_categories_alias_norm
  ON public.cic_news_categories (lower(btrim(alias)))
  WHERE alias IS NOT NULL AND btrim(alias) <> '';

CREATE UNIQUE INDEX IF NOT EXISTS ux_cic_news_categories_en_alias_norm
  ON public.cic_news_categories_en (lower(btrim(alias)))
  WHERE alias IS NOT NULL AND btrim(alias) <> '';

COMMIT;
