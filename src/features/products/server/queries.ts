import 'server-only';
import { getPostgresClient } from '@/server/db/postgres';
import type { ProductViewModel } from '../types';
import type { Product } from '@/shared/types';
type Row={id:unknown;name:unknown;alias:unknown;summary:unknown;description:unknown;image:unknown;published:unknown;ordering:unknown;category_name?:unknown};
const map=(r:Row):ProductViewModel=>({id:String(r.id),title:String(r.name??''),slug:String(r.alias??r.id),summary:r.summary==null?(r.description==null?null:String(r.description)):String(r.summary),image:r.image==null?null:String(r.image),category:r.category_name==null?null:String(r.category_name),published:r.published===true,ordering:Number(r.ordering??0)});
export async function listPublishedProducts(options:{categoryAlias?:string;search?:string}={}){const sql=getPostgresClient(),category=options.categoryAlias?.trim()||null,search=options.search?.trim()||null;const rows=await sql`SELECT p.id,p.name,p.alias,p.summary,p.description,p.image,p.published,p.ordering,(SELECT string_agg(c.name,', ' ORDER BY c.ordering,c.id) FROM cic_products_categories_rel r JOIN cic_products_categories c ON c.id=r.category_id AND c.published=true WHERE r.product_id=p.id) category_name FROM cic_products p WHERE p.published=true AND (${category}::text IS NULL OR EXISTS(SELECT 1 FROM cic_products_categories_rel r JOIN cic_products_categories c ON c.id=r.category_id WHERE r.product_id=p.id AND c.published=true AND c.alias=${category})) AND (${search}::text IS NULL OR p.name ILIKE '%'||${search}||'%' OR p.summary ILIKE '%'||${search}||'%') ORDER BY p.ordering,p.id`;return rows.map(r=>map(r as Row));}
export async function getPublishedProductBySlug(slug:string){const sql=getPostgresClient();const[row]=await sql`SELECT p.id,p.name,p.alias,p.summary,p.description,p.image,p.published,p.ordering,(SELECT string_agg(c.name,', ' ORDER BY c.ordering,c.id) FROM cic_products_categories_rel r JOIN cic_products_categories c ON c.id=r.category_id AND c.published=true WHERE r.product_id=p.id) category_name FROM cic_products p WHERE p.published=true AND p.alias=${slug} LIMIT 1`;return row?map(row as Row):null;}

type ReferenceRow = {
  id: unknown; name: unknown; price: unknown; summary: unknown; description: unknown;
  image: unknown; icon: unknown; manufactory_name: unknown; application_name: unknown;
  types_name: unknown; video: unknown; link_video: unknown; feature_details: unknown;
  category_name: unknown;
};

/** Public DTO shaped for the established React product presentation. */
export async function listPublishedProductsForReference(): Promise<Product[]> {
  const sql = getPostgresClient();
  const rows = await sql<ReferenceRow[]>`
    SELECT p.id,p.name,p.price,p.summary,p.description,p.image,p.icon,
      coalesce(b.name,p.manufactory_name) manufactory_name,p.application_name,p.types_name,p.video,p.link_video,p.feature_details,
      (SELECT string_agg(c.name,', ' ORDER BY c.ordering,c.id)
       FROM cic_products_categories_rel r
       JOIN cic_products_categories c ON c.id=r.category_id AND c.published=true
       WHERE r.product_id=p.id) category_name
    FROM cic_products p
    LEFT JOIN cic_manufactories b
      ON b.id = CASE WHEN p.manufactory ~ '^[0-9]+$' THEN p.manufactory::int END
      AND b.published=true
    WHERE p.published=true
    ORDER BY p.ordering,p.id
  `;
  return rows.map((row) => ({
    id: Number(row.id),
    name: String(row.name ?? ''),
    price: String(row.price ?? 'Liên hệ'),
    description: String(row.summary ?? row.description ?? ''),
    desc: row.description == null ? undefined : String(row.description),
    field: String(row.category_name ?? 'Khác'),
    brand: String(row.manufactory_name ?? 'Đang cập nhật'),
    app: String(row.application_name ?? 'Đang cập nhật'),
    img: String(row.image ?? row.icon ?? ''),
    icon: row.icon == null ? undefined : String(row.icon),
    productType: row.types_name == null ? undefined : String(row.types_name),
    overviewHtml: row.description == null ? undefined : String(row.description),
    featuresHtml: row.feature_details == null ? undefined : String(row.feature_details),
    videoUrl: row.link_video == null ? (row.video == null ? undefined : String(row.video)) : String(row.link_video),
  }));
}
