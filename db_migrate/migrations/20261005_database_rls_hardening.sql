-- Migration: 20261005_database_rls_hardening.sql
-- Description: Hardening Supabase Row Level Security (RLS) across all public tables,
-- revoking unauthorized anon privileges on cic_contact, and enforcing defense-in-depth default deny.

BEGIN;

SELECT pg_advisory_xact_lock(hashtext('cic_database_rls_hardening'));

-- 1. Revoke all unauthorized permissions granted to anon and PUBLIC across all public tables
-- In this architecture, all user queries and CMS operations flow through Next.js Server-DAL.
-- The anonymous client (anon key) must never have direct REST mutation or inspection rights.
REVOKE ALL ON TABLE public.cic_contact FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;

-- 2. Dynamically enable ROW LEVEL SECURITY on every table in the public schema
-- This satisfies Supabase Security Advisor Linter and enforces defense-in-depth.
DO $rls_enable_all$
DECLARE
  tbl record;
BEGIN
  FOR tbl IN
    SELECT c.relname AS table_name
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' 
      AND c.relkind = 'r'
      AND NOT c.relrowsecurity
    ORDER BY c.relname
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl.table_name);
  END LOOP;
END
$rls_enable_all$;

-- 3. Configure CMS authenticated read policies for newly-protected catalog & relation tables
-- Enables granular read access for authenticated CMS operators via cic_cms_has_permission.
DO $cms_catalog_read_policies$
DECLARE
  item record;
  policy_name text;
BEGIN
  FOR item IN
    SELECT * FROM (VALUES
      ('cic_products_categories_rel', 'products'),
      ('cic_products_categories_rel_en', 'products'),
      ('cic_products_applications_rel', 'products'),
      ('cic_products_applications_rel_en', 'products'),
      ('cic_products_related_rel', 'products'),
      ('cic_products_related_rel_en', 'products'),
      ('cic_products_images', 'products'),
      ('cic_products_images_en', 'products'),
      ('cic_products_price', 'products'),
      ('cic_products_incentives', 'products'),
      ('cic_products_tables', 'products'),
      ('cic_products_tables_en', 'products'),
      ('cic_products_filters', 'product_settings'),
      ('cic_products_filters_values', 'product_settings'),
      ('cic_projects_products_rel', 'projects'),
      ('cic_projects_products_rel_en', 'projects'),
      ('cic_projects_services_rel', 'projects'),
      ('cic_projects_services_rel_en', 'projects'),
      ('cic_services_products_rel', 'services'),
      ('cic_services_products_rel_en', 'services'),
      ('cic_content_page_revisions', 'static_pages'),
      ('cic_content_page_sections', 'static_pages'),
      ('cic_content_page_section_references', 'static_pages'),
      ('cic_banners', 'settings'),
      ('cic_banners_en', 'settings'),
      ('cic_banners_categories', 'settings'),
      ('cic_banners_categories_en', 'settings'),
      ('cic_menus_groups', 'settings'),
      ('cic_menus_groups_en', 'settings'),
      ('cic_menus_items', 'settings'),
      ('cic_menus_items_en', 'settings'),
      ('cic_redirects', 'function_seo'),
      ('cic_form_destinations', 'forms')
    ) AS configured(table_name, permission_module)
    WHERE to_regclass('public.' || configured.table_name) IS NOT NULL
  LOOP
    policy_name := 'cms_authenticated_read_' || item.table_name;
    EXECUTE format('GRANT SELECT ON TABLE public.%I TO authenticated', item.table_name);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, item.table_name);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (public.cic_cms_has_permission(%L, %L))',
      policy_name, item.table_name, item.permission_module, 'view'
    );
  END LOOP;
END
$cms_catalog_read_policies$;

-- 4. Confirm default-deny on customer submissions & audit logs:
-- Tables such as cic_form_submissions, cic_form_submission_values, cic_form_submission_deliveries,
-- cic_customer_request_states, cic_customer_request_notes, cic_customer_request_events,
-- cic_email_templates, cic_email_template_versions now have RLS enabled with NO policies,
-- guaranteeing that only the trusted Server-DAL can query or mutate customer data.

COMMIT;
