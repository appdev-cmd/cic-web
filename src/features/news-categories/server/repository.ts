import 'server-only';
import type { Sql } from 'postgres';
import { withTransaction } from '@/server/db/postgres';
import type { CmsPrincipal } from '@/server/auth/guards';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { writeAuditEvent } from '@/server/audit/writer';
import { moveNewsCategoryToTrash } from '@/features/trash/server/adapters/news-category';
import type { NewsCategoryInput } from '../schemas/newsCategoryInput';
import type { NewsCategoryLocale } from '../types';

const table = (locale: NewsCategoryLocale) => locale === 'en' ? 'cic_news_categories_en' : 'cic_news_categories';

async function validate(sql: Sql, locale: NewsCategoryLocale, input: NewsCategoryInput, id: number | null) {
  const source = table(locale);
  if ((await sql.unsafe(`SELECT 1 FROM ${source} WHERE lower(btrim(alias))=lower(btrim($1)) AND ($2::int IS NULL OR id<>$2) LIMIT 1`, [input.alias, id])).length) throw new Error('Đường dẫn đã được một danh mục khác sử dụng.');
  if (input.parentId != null) {
    if (input.parentId === id) throw new Error('Danh mục không thể là cha của chính nó.');
    if (!(await sql.unsafe(`SELECT 1 FROM ${source} WHERE id=$1`, [input.parentId])).length) throw new Error('Danh mục cha không tồn tại.');
    if (id && (await sql.unsafe(`WITH RECURSIVE tree AS (SELECT id FROM ${source} WHERE parent_id=$1 UNION ALL SELECT c.id FROM ${source} c JOIN tree t ON c.parent_id=t.id) SELECT 1 FROM tree WHERE id=$2 LIMIT 1`, [id, input.parentId])).length) throw new Error('Không thể chọn danh mục con làm danh mục cha.');
  }
}

async function hierarchy(sql: Sql, locale: NewsCategoryLocale, parentId: number | null, alias: string) {
  if (parentId == null) return { level: 0, listParents: null as string | null, aliasWrapper: `,${alias},` };
  const [parent] = await sql.unsafe(`SELECT id,level,list_parents,alias_wrapper FROM ${table(locale)} WHERE id=$1`, [parentId]);
  if (!parent) throw new Error('Danh mục cha không tồn tại.');
  const parentIds = String(parent.list_parents ?? '').replace(/^,|,$/g, '');
  return { level: Number(parent.level ?? 0) + 1, listParents: `,${[parentIds, String(parent.id)].filter(Boolean).join(',')},`, aliasWrapper: `${String(parent.alias_wrapper ?? ',')}${alias},` };
}

async function rebuildHierarchy(sql: Sql, locale: NewsCategoryLocale) {
  const source = table(locale);
  await sql.unsafe(`WITH RECURSIVE tree AS (SELECT id,parent_id,alias,0 level,NULL::text list_parents,(','||alias||',')::text alias_wrapper FROM ${source} WHERE parent_id IS NULL UNION ALL SELECT c.id,c.parent_id,c.alias,t.level+1,(','||concat_ws(',',nullif(trim(both ',' from coalesce(t.list_parents,'')),''),t.id::text)||',')::text,(t.alias_wrapper||c.alias||',')::text FROM ${source} c JOIN tree t ON c.parent_id=t.id) UPDATE ${source} c SET level=t.level,list_parents=t.list_parents,alias_wrapper=t.alias_wrapper FROM tree t WHERE c.id=t.id`);
}

export async function saveNewsCategory(locale: NewsCategoryLocale, id: number | null, input: NewsCategoryInput, actor: CmsPrincipal) {
  return withTransaction(async (sql) => {
    await validate(sql, locale, input, id); const source = table(locale); const derived = await hierarchy(sql, locale, input.parentId, input.alias);
    const before = id ? (await sql.unsafe(`SELECT id,name,title,alias,summary,parent_id,ordering,image,published,show_in_homepage,seo_title,seo_keyword,seo_description FROM ${source} WHERE id=$1 FOR UPDATE`, [id]))[0] : null;
    if (id && !before) throw new Error('Không tìm thấy danh mục tin tức.');
    const values = [input.name,input.title,input.alias,input.summary,input.parentId,input.ordering,input.image,input.published,input.showInHomepage,input.seoTitle,input.seoKeyword,input.seoDescription,derived.level,derived.listParents,derived.aliasWrapper,id];
    const rows = id ? await sql.unsafe(`UPDATE ${source} SET name=$1,title=$2,alias=$3,summary=$4,parent_id=$5,ordering=$6,image=$7,published=$8,show_in_homepage=$9,seo_title=$10,seo_keyword=$11,seo_description=$12,level=$13,list_parents=$14,alias_wrapper=$15,updated_time=now() WHERE id=$16 RETURNING id,name`, values) : await sql.unsafe(`INSERT INTO ${source} (name,title,alias,summary,parent_id,ordering,image,published,show_in_homepage,seo_title,seo_keyword,seo_description,level,list_parents,alias_wrapper,display_title,display_tags,display_related,display_created_time,display_category,display_comment,display_sharing,created_time,updated_time) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,true,true,true,true,true,true,true,now(),now()) RETURNING id,name`, values.slice(0,15));
    await rebuildHierarchy(sql, locale); const row = rows[0];
    await writeAuditEvent(actor, { action: id ? AUDIT_ACTIONS.NEWS_CATEGORY_UPDATED : AUDIT_ACTIONS.NEWS_CATEGORY_CREATED, entityType: AUDIT_ENTITY_TYPES.NEWS_CATEGORY, entityId: String(row.id), entityTitle: String(row.name), module: 'news', workspace: locale, result: 'success', before, after: input }, sql);
    return { id: String(row.id) };
  });
}

export async function setNewsCategoryPublished(locale: NewsCategoryLocale, id: number, published: boolean, actor: CmsPrincipal) {
  return withTransaction(async (sql) => { const rows = await sql.unsafe(`UPDATE ${table(locale)} SET published=$1,show_in_homepage=CASE WHEN $1 THEN show_in_homepage ELSE false END,updated_time=now() WHERE id=$2 RETURNING id,name`, [published,id]); if (!rows.length) throw new Error('Danh mục không còn tồn tại.'); const row=rows[0]; await writeAuditEvent(actor,{action:AUDIT_ACTIONS.NEWS_CATEGORY_STATUS_CHANGED,entityType:AUDIT_ENTITY_TYPES.NEWS_CATEGORY,entityId:String(row.id),entityTitle:String(row.name),module:'news',workspace:locale,result:'success',after:{published}},sql); });
}
export async function setNewsCategoryHomepage(locale: NewsCategoryLocale, id: number, showInHomepage: boolean, actor: CmsPrincipal) { return withTransaction(async (sql) => { const rows=await sql.unsafe(`UPDATE ${table(locale)} SET show_in_homepage=$1,updated_time=now() WHERE id=$2 AND published=true RETURNING id,name`,[showInHomepage,id]); if(!rows.length)throw new Error('Chỉ danh mục đang xuất bản mới được hiển thị trên Trang chủ.');const row=rows[0];await writeAuditEvent(actor,{action:AUDIT_ACTIONS.NEWS_CATEGORY_UPDATED,entityType:AUDIT_ENTITY_TYPES.NEWS_CATEGORY,entityId:String(row.id),entityTitle:String(row.name),module:'news',workspace:locale,result:'success',after:{showInHomepage}},sql); }); }
export async function trashNewsCategory(locale: NewsCategoryLocale,id:number,actor:CmsPrincipal){return withTransaction(async(sql)=>{const moved=await moveNewsCategoryToTrash(sql,locale,id,actor.legacyUserId);await writeAuditEvent(actor,{action:AUDIT_ACTIONS.NEWS_CATEGORY_TRASHED,entityType:AUDIT_ENTITY_TYPES.NEWS_CATEGORY,entityId:String(id),entityTitle:moved.title,module:'news',workspace:locale,result:'success',after:{trashId:moved.trashId,state:'trashed'}},sql);return moved;});}
