import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import type { ProductViewModel } from '../types';
import type { Product } from '@/shared/types';
import { extractProductVideoUrl, normalizeProductHtml, normalizeProductMediaUrl } from '../mappers';
type ProductReference = Product & { slug: string };
type Row={id:unknown;name:unknown;alias:unknown;summary:unknown;description:unknown;image:unknown;published:unknown;ordering:unknown;category_name?:unknown};
const map=(r:Row):ProductViewModel=>({id:String(r.id),title:String(r.name??''),slug:String(r.alias??r.id),summary:r.summary==null?(r.description==null?null:String(r.description)):String(r.summary),image:r.image==null?null:String(r.image),category:r.category_name==null?null:String(r.category_name),published:r.published===true,ordering:Number(r.ordering??0)});
export async function listPublishedProducts(options:{categoryAlias?:string;search?:string}={}){const sql=getPostgresClient(),category=options.categoryAlias?.trim()||null,search=options.search?.trim()||null;const rows=await sql`SELECT p.id,p.name,p.alias,p.summary,p.description,p.image,p.published,p.ordering,(SELECT string_agg(c.name,', ' ORDER BY c.ordering,c.id) FROM cic_products_categories_rel r JOIN cic_products_categories c ON c.id=r.category_id AND c.published=true WHERE r.product_id=p.id) category_name FROM cic_products p WHERE p.published=true AND (${category}::text IS NULL OR EXISTS(SELECT 1 FROM cic_products_categories_rel r JOIN cic_products_categories c ON c.id=r.category_id WHERE r.product_id=p.id AND c.published=true AND c.alias=${category})) AND (${search}::text IS NULL OR p.name ILIKE '%'||${search}||'%' OR p.summary ILIKE '%'||${search}||'%') ORDER BY p.ordering,p.id`;return rows.map(r=>map(r as Row));}
export async function getPublishedProductBySlug(slug:string){const sql=getPostgresClient();const[row]=await sql`SELECT p.id,p.name,p.alias,p.summary,p.description,p.image,p.published,p.ordering,(SELECT string_agg(c.name,', ' ORDER BY c.ordering,c.id) FROM cic_products_categories_rel r JOIN cic_products_categories c ON c.id=r.category_id AND c.published=true WHERE r.product_id=p.id) category_name FROM cic_products p WHERE p.published=true AND p.alias=${slug} LIMIT 1`;return row?map(row as Row):null;}

type ReferenceRow = {
  id: unknown; name: unknown; alias: unknown; price: unknown; summary: unknown; description: unknown;
  image: unknown; icon: unknown; manufactory_name: unknown; application_names: unknown;
  product_type_name: unknown; video: unknown; link_video: unknown; feature_details: unknown;
  category_names: unknown;
  tags: unknown;
  seo_title: unknown; seo_description: unknown;
  slides: unknown; related_ids: unknown;
  file_name1: unknown; file_download1: unknown; link_download1: unknown;
  file_name2: unknown; file_download2: unknown; link_download2: unknown;
  file_name3: unknown; file_download3: unknown; link_download3: unknown;
  file_name4: unknown; file_download4: unknown; link_download4: unknown;
  file_name5: unknown; file_download5: unknown; link_download5: unknown;
  file_name6: unknown; file_download6: unknown; link_download6: unknown;
};

function mapReferenceRow(row: ReferenceRow, locale: 'vi' | 'en' = 'vi'): ProductReference {
  const applications = Array.isArray(row.application_names)
    ? row.application_names.map((name) => String(name)).filter(Boolean)
    : [];
  const categories = Array.isArray(row.category_names)
    ? row.category_names.map((name) => String(name)).filter(Boolean)
    : [];
  const documents = Array.from({ length: 6 }, (_, index) => {
    const position = index + 1;
    const name = row[`file_name${position}` as keyof ReferenceRow];
    const file = row[`file_download${position}` as keyof ReferenceRow];
    const link = row[`link_download${position}` as keyof ReferenceRow];
    const url = String(link ?? file ?? '').trim();
    const fallbackName = locale === 'en' ? `Document ${position}` : `Tài liệu ${position}`;
    return url ? { name: String(name ?? fallbackName), url } : null;
  }).filter((item): item is { name: string; url: string } => item !== null);

  const fallbackPrice = locale === 'en' ? 'Contact for Quote' : 'Liên hệ';
  const fallbackField = locale === 'en' ? 'General' : 'Khác';
  const fallbackUpdating = locale === 'en' ? 'Updating' : 'Đang cập nhật';

  return {
    id: Number(row.id),
    slug: String(row.alias ?? row.id),
    name: String(row.name ?? ''),
    price: String(row.price ?? fallbackPrice),
    description: String(row.summary ?? row.description ?? ''),
    desc: row.description == null ? undefined : String(row.description),
    field: categories.join(', ') || fallbackField,
    categories,
    brand: String(row.manufactory_name ?? fallbackUpdating),
    app: applications.join(', ') || fallbackUpdating,
    applications,
    tags: String(row.tags ?? '').split(',').map((tag) => tag.trim()).filter(Boolean),
    img: normalizeProductMediaUrl(row.image ?? row.icon),
    icon: row.icon == null ? undefined : normalizeProductMediaUrl(row.icon),
    productType: row.product_type_name == null ? undefined : String(row.product_type_name),
    overviewHtml: row.description == null ? undefined : normalizeProductHtml(row.description),
    featuresHtml: row.feature_details == null ? undefined : normalizeProductHtml(row.feature_details),
    videoUrl: extractProductVideoUrl(row.link_video ?? row.video),
    slides: Array.isArray(row.slides) ? row.slides.map(normalizeProductMediaUrl).filter(Boolean) : undefined,
    relatedProductIds: Array.isArray(row.related_ids) ? row.related_ids.map(Number).filter(Number.isFinite) : [],
    documents,
    seoTitle: row.seo_title == null ? undefined : String(row.seo_title),
    seoDescription: row.seo_description == null ? undefined : String(row.seo_description),
  };
}

/** Public DTO shaped for the established React product presentation. */
export async function listPublishedProductsForReference(locale: 'vi' | 'en' = 'vi'): Promise<ProductReference[]> {
  const sql = getPostgresClient();
  const isEn = locale === 'en';
  const pTable = isEn ? sql`cic_products_en` : sql`cic_products`;
  const mfgTable = isEn ? sql`cic_manufactories_en` : sql`cic_manufactories`;
  const typeTable = isEn ? sql`cic_products_types_en` : sql`cic_products_types`;
  const catRelTable = isEn ? sql`cic_products_categories_rel_en` : sql`cic_products_categories_rel`;
  const catTable = isEn ? sql`cic_products_categories_en` : sql`cic_products_categories`;
  const appRelTable = isEn ? sql`cic_products_applications_rel_en` : sql`cic_products_applications_rel`;
  const imgTable = isEn ? sql`cic_products_images_en` : sql`cic_products_images`;
  const relTable = isEn ? sql`cic_products_related_rel_en` : sql`cic_products_related_rel`;

  const rows = await sql<ReferenceRow[]>`
    SELECT p.id,p.name,p.alias,p.price,p.summary,p.description,p.image,p.icon,p.tags,p.seo_title,p.seo_description,
      coalesce(b.name,p.manufactory_name) manufactory_name,
      (SELECT array_agg(a.name ORDER BY r.ordering,a.ordering,a.id)
       FROM ${appRelTable} r
       JOIN cic_application a ON a.id=r.application_id AND a.published=true
       WHERE r.product_id=p.id) application_names,
      t.name product_type_name,p.video,p.link_video,p.feature_details,
      p.file_name1,p.file_download1,p.link_download1,p.file_name2,p.file_download2,p.link_download2,
      p.file_name3,p.file_download3,p.link_download3,p.file_name4,p.file_download4,p.link_download4,
      p.file_name5,p.file_download5,p.link_download5,p.file_name6,p.file_download6,p.link_download6,
      (SELECT array_agg(i.image ORDER BY i.ordering,i.id) FROM ${imgTable} i WHERE i.record_id=p.id AND i.image IS NOT NULL AND btrim(i.image)<>'') slides,
      (SELECT array_agg(r.related_product_id ORDER BY r.ordering,r.related_product_id) FROM ${relTable} r JOIN ${pTable} rp ON rp.id=r.related_product_id AND rp.published=true WHERE r.product_id=p.id) related_ids,
      (SELECT array_agg(c.name ORDER BY c.ordering,c.id)
       FROM ${catRelTable} r
       JOIN ${catTable} c ON c.id=r.category_id AND c.published=true
       WHERE r.product_id=p.id) category_names
    FROM ${pTable} p
    LEFT JOIN ${mfgTable} b
      ON b.id = CASE WHEN p.manufactory ~ '^[0-9]+$' THEN p.manufactory::int END
      AND b.published=true
    LEFT JOIN ${typeTable} t ON t.id=p.types_id AND t.published=true
    WHERE p.published=true
    ORDER BY p.ordering,p.id
  `;
  return rows.map((r) => mapReferenceRow(r, locale));
}

/** Direct query single published product by alias/slug for instant performance */
export async function getPublishedProductBySlugForReference(slug: string, locale: 'vi' | 'en' = 'vi'): Promise<ProductReference | null> {
  const sql = getPostgresClient();
  const trimmed = slug.trim();
  if (!trimmed) return null;
  const isEn = locale === 'en';
  const pTable = isEn ? sql`cic_products_en` : sql`cic_products`;
  const mfgTable = isEn ? sql`cic_manufactories_en` : sql`cic_manufactories`;
  const typeTable = isEn ? sql`cic_products_types_en` : sql`cic_products_types`;
  const catRelTable = isEn ? sql`cic_products_categories_rel_en` : sql`cic_products_categories_rel`;
  const catTable = isEn ? sql`cic_products_categories_en` : sql`cic_products_categories`;
  const appRelTable = isEn ? sql`cic_products_applications_rel_en` : sql`cic_products_applications_rel`;
  const imgTable = isEn ? sql`cic_products_images_en` : sql`cic_products_images`;
  const relTable = isEn ? sql`cic_products_related_rel_en` : sql`cic_products_related_rel`;

  const rows = await sql<ReferenceRow[]>`
    SELECT p.id,p.name,p.alias,p.price,p.summary,p.description,p.image,p.icon,p.tags,p.seo_title,p.seo_description,
      coalesce(b.name,p.manufactory_name) manufactory_name,
      (SELECT array_agg(a.name ORDER BY r.ordering,a.ordering,a.id)
       FROM ${appRelTable} r
       JOIN cic_application a ON a.id=r.application_id AND a.published=true
       WHERE r.product_id=p.id) application_names,
      t.name product_type_name,p.video,p.link_video,p.feature_details,
      p.file_name1,p.file_download1,p.link_download1,p.file_name2,p.file_download2,p.link_download2,
      p.file_name3,p.file_download3,p.link_download3,p.file_name4,p.file_download4,p.link_download4,
      p.file_name5,p.file_download5,p.link_download5,p.file_name6,p.file_download6,p.link_download6,
      (SELECT array_agg(i.image ORDER BY i.ordering,i.id) FROM ${imgTable} i WHERE i.record_id=p.id AND i.image IS NOT NULL AND btrim(i.image)<>'') slides,
      (SELECT array_agg(r.related_product_id ORDER BY r.ordering,r.related_product_id) FROM ${relTable} r JOIN ${pTable} rp ON rp.id=r.related_product_id AND rp.published=true WHERE r.product_id=p.id) related_ids,
      (SELECT array_agg(c.name ORDER BY c.ordering,c.id)
       FROM ${catRelTable} r
       JOIN ${catTable} c ON c.id=r.category_id AND c.published=true
       WHERE r.product_id=p.id) category_names
    FROM ${pTable} p
    LEFT JOIN ${mfgTable} b
      ON b.id = CASE WHEN p.manufactory ~ '^[0-9]+$' THEN p.manufactory::int END
      AND b.published=true
    LEFT JOIN ${typeTable} t ON t.id=p.types_id AND t.published=true
    WHERE p.published=true AND (p.alias=${trimmed} OR (p.alias IS NULL AND p.id::text=${trimmed}))
    LIMIT 1
  `;
  return rows[0] ? mapReferenceRow(rows[0], locale) : null;
}
