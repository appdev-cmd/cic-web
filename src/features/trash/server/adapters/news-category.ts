import 'server-only';
import type { Sql } from 'postgres';
import { z } from 'zod';
import type { NewsCategoryLocale } from '@/features/news-categories/types';
import type { TrashRestoreMode } from '../../types';
import type { TrashEntityAdapter, TrashInspection } from '../registry-types';

const snapshotSchema = z.object({ version: z.literal(1), locale: z.enum(['vi', 'en']), record: z.record(z.string(), z.unknown()) });
const table = (locale: NewsCategoryLocale) => locale === 'en' ? 'cic_news_categories_en' : 'cic_news_categories';
const newsTable = (locale: NewsCategoryLocale) => locale === 'en' ? 'cic_news_en' : 'cic_news';
const columns = ['id','alias_wrapper','parent_id','list_parents','level','published','ordering','image','icon','created_time','updated_time','show_in_homepage','display_title','display_tags','display_related','display_created_time','display_category','display_comment','display_sharing','name_display','is_comment','display_summary','products_related','icon_font','estore_id','category_id','name','alias','seo_title','seo_keyword','seo_description','summary','title','actflg','ctdusr','ctdwks','ctddtm','mdfusr','mdfwks','lstmdf','cdtpgm','mdfpgm'] as const;

export async function moveNewsCategoryToTrash(sql: Sql, locale: NewsCategoryLocale, id: number, actorId: number) {
  const source = table(locale), news = newsTable(locale);
  const [row] = await sql.unsafe(`SELECT ${columns.join(',')} FROM ${source} WHERE id=$1 FOR UPDATE`, [id]);
  if (!row) throw new Error('Không tìm thấy danh mục tin tức.');
  const [{ count: usage }] = await sql.unsafe(`SELECT count(*)::int count FROM ${news} WHERE category_id=$1`, [id]);
  const [{ count: children }] = await sql.unsafe(`SELECT count(*)::int count FROM ${source} WHERE parent_id=$1`, [id]);
  if (Number(usage) > 0) throw new Error(`Danh mục đang được ${usage} bài viết sử dụng; hãy đổi phân loại trước khi xóa.`);
  if (Number(children) > 0) throw new Error(`Danh mục còn ${children} danh mục con; hãy chuyển cấp con trước khi xóa.`);
  const record = Object.fromEntries(columns.map((column) => [column, row[column] instanceof Date ? (row[column] as Date).toISOString() : row[column]]));
  const snapshot = snapshotSchema.parse({ version: 1, locale, record });
  const entityType = locale === 'en' ? 'news_category_en' : 'news_category';
  const title = String(row.name ?? row.alias ?? id);
  const [trash] = await sql`INSERT INTO cic_trash_items (workspace,entity_type,entity_id,module,title_snapshot,payload_snapshot,original_url,status,deleted_by,purge_after,restore_state) VALUES (${locale},${entityType},${String(id)},'news',${title},${sql.json(snapshot as never)},${`/news?category=${String(row.alias ?? '')}`},'trashed',${actorId},now()+interval '30 days','inactive') RETURNING id`;
  await sql.unsafe(`DELETE FROM ${source} WHERE id=$1`, [id]);
  return { trashId: String(trash.id), title };
}

async function inspect(sql: Sql, value: unknown): Promise<TrashInspection> {
  const parsed = snapshotSchema.safeParse(value);
  if (!parsed.success) return { status: 'schema_mismatch', details: 'Snapshot danh mục tin tức không đúng phiên bản.', restoreModes: [] };
  const source = table(parsed.data.locale), record = parsed.data.record;
  const conflicts = await sql.unsafe(`SELECT 1 FROM ${source} WHERE id=$1 OR lower(btrim(alias))=lower(btrim($2)) LIMIT 1`, [Number(record.id), String(record.alias ?? '')]);
  if (conflicts.length) return { status: 'conflict', details: 'ID hoặc đường dẫn danh mục đã được sử dụng.', restoreModes: [] };
  if (record.parent_id != null && !(await sql.unsafe(`SELECT 1 FROM ${source} WHERE id=$1`, [Number(record.parent_id)])).length) return { status: 'parent_trashed', details: 'Danh mục cha không còn tồn tại hoặc đang ở trong Thùng rác.', restoreModes: [] };
  return { status: 'clear', details: 'Danh mục sẵn sàng phục hồi ở trạng thái tạm ẩn.', restoreModes: ['as_draft'] };
}

async function restore(sql: Sql, value: unknown, mode: TrashRestoreMode) {
  const snapshot = snapshotSchema.parse(value), inspection = await inspect(sql, snapshot);
  if (!inspection.restoreModes.includes(mode)) throw new Error(inspection.details);
  const source = table(snapshot.locale), restored: Record<string, unknown> = { ...snapshot.record, published: false, show_in_homepage: false, updated_time: new Date() };
  await sql.unsafe(`INSERT INTO ${source} (${columns.join(',')}) OVERRIDING SYSTEM VALUE VALUES (${columns.map((_, index) => `$${index + 1}`).join(',')})`, columns.map((column) => (restored[column] ?? null) as never));
  return { title: String(restored.name ?? restored.alias ?? restored.id), restoredEntityId: String(restored.id), restoredState: 'inactive' as const };
}

export const newsCategoryTrashAdapter: TrashEntityAdapter = { entityType: 'news_category', module: 'news', label: 'Danh mục tin tức', itemType: 'Danh mục tin tức', workspace: 'vi', restoreState: 'inactive', supportsPurge: true, getRevalidationTargets: () => [{ path: '/cms/news/categories' }, { path: '/news' }, { path: '/' }], parseSnapshot: (value) => snapshotSchema.parse(value), inspect, restore, purge: async () => undefined, presentSnapshot: (value) => { const snapshot = snapshotSchema.parse(value); return { version: snapshot.version, locale: snapshot.locale, name: snapshot.record.name, alias: snapshot.record.alias, parentId: snapshot.record.parent_id }; } };
export const newsCategoryEnTrashAdapter: TrashEntityAdapter = { ...newsCategoryTrashAdapter, entityType: 'news_category_en', workspace: 'en' };
