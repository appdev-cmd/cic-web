import 'server-only';
import type { Sql } from 'postgres';
import type { CmsPrincipal } from '@/server/auth/guards';
import { withTransaction } from '@/server/db/postgres';
import { writeAuditEvent } from '@/server/audit/writer';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { moveNewsToTrash } from '@/features/trash/server/adapters/news';
import type { NewsInput } from '../schemas/newsInput';
import { assertNewsPlacementCapacity, type NewsLocale } from './placement';

const tables=(locale:NewsLocale)=>locale==='en'?{news:'cic_news_en',category:'cic_news_categories_en',product:'cic_products_en',sequence:'cic_news_en_id_seq'}:{news:'cic_news',category:'cic_news_categories',product:'cic_products',sequence:'cic_news_id_seq'};
const cleanHtml=(value:string)=>value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/\son\w+\s*=\s*(['"]).*?\1/gi,'').replace(/javascript:/gi,'');
const csv=(values:number[])=>[...new Set(values)].join(',');

async function validate(sql:Sql,locale:NewsLocale,id:number|null,value:NewsInput){
  const t=tables(locale);
  if((await sql.unsafe(`SELECT 1 FROM ${t.news} WHERE lower(btrim(alias))=lower(btrim($1)) AND ($2::int IS NULL OR id<>$2) LIMIT 1`,[value.alias,id])).length)throw new Error('Alias đã được bài viết khác sử dụng.');
  if(!(await sql.unsafe(`SELECT 1 FROM ${t.category} WHERE id=$1`,[value.categoryId])).length)throw new Error('Danh mục tin tức không hợp lệ.');
  if(value.relatedNewsIds.includes(id??-1))throw new Error('Bài viết không thể liên quan chính nó.');
  if(value.relatedNewsIds.length&&(await sql.unsafe(`SELECT id FROM ${t.news} WHERE id=ANY($1::int[])`,[value.relatedNewsIds])).length!==new Set(value.relatedNewsIds).size)throw new Error('Tin liên quan không hợp lệ.');
  if(value.relatedProductIds.length&&(await sql.unsafe(`SELECT id FROM ${t.product} WHERE id=ANY($1::int[])`,[value.relatedProductIds])).length!==new Set(value.relatedProductIds).size)throw new Error('Sản phẩm liên quan không hợp lệ.');
}

export async function saveNews(locale:NewsLocale,id:number|null,value:NewsInput,actor:CmsPrincipal){return withTransaction(async(sql)=>{
  await validate(sql,locale,id,value);const t=tables(locale);
  const before=id?(await sql.unsafe(`SELECT id,title,alias,published,is_hot,show_in_homepage FROM ${t.news} WHERE id=$1 FOR UPDATE`,[id]))[0]:null;
  if(id&&!before)throw new Error('Không tìm thấy bài viết.');
  if(value.isHot&&!before?.is_hot)await assertNewsPlacementCapacity(sql,locale,'hot',id);
  if(value.showInHomepage&&!before?.show_in_homepage)await assertNewsPlacementCapacity(sql,locale,'home',id);
  const data=[value.title,value.alias,value.other_languages1,value.categoryId,value.summary,cleanHtml(value.content),value.image,cleanHtml(value.video),value.fileUpload,value.tags.join(','),csv(value.relatedNewsIds),csv(value.relatedProductIds),value.startTime,value.endTime||null,value.published,value.isHot,value.showInHomepage,value.ordering,value.seoTitle,value.seoKeyword,value.seoDescription,value.tawkTo,actor.fullName,actor.legacyUserId];
  const columns=['title','alias','other_languages1','category_id','summary','content','image','video','file_upload','tags','news_related','products_related','start_time','end_time','published','is_hot','show_in_homepage','ordering','seo_title','seo_keyword','seo_description','tawk_to','author_last','author_last_id'];
  let row;
  if(id)[row]=await sql.unsafe(`UPDATE ${t.news} SET ${columns.map((column,index)=>`${column}=$${index+1}`).join(',')},updated_time=now() WHERE id=$${data.length+1} RETURNING id,title`,[...data,id]);
  else [row]=await sql.unsafe(`INSERT INTO ${t.news}(${columns.join(',')},hits,display_title,is_new,created_time,updated_time,author,author_id) VALUES(${data.map((_,index)=>`$${index+1}`).join(',')},0,true,true,now(),now(),$${data.length-1},$${data.length}) RETURNING id,title`,data);
  await writeAuditEvent(actor,{action:id?AUDIT_ACTIONS.NEWS_UPDATED:AUDIT_ACTIONS.NEWS_CREATED,entityType:AUDIT_ENTITY_TYPES.NEWS,entityId:String(row.id),entityTitle:String(row.title),module:'news',workspace:locale,result:'success',before,after:value},sql);
  return{id:String(row.id)};
});}

export async function setNewsPublished(locale:NewsLocale,ids:number[],published:boolean,actor:CmsPrincipal){return withTransaction(async(sql)=>{const t=tables(locale).news;const rows=await sql.unsafe(`UPDATE ${t} SET published=$1,updated_time=now() WHERE id=ANY($2::int[]) RETURNING id,title`,[published,ids]);if(rows.length!==new Set(ids).size)throw new Error('Một hoặc nhiều bài viết không tồn tại.');for(const row of rows)await writeAuditEvent(actor,{action:AUDIT_ACTIONS.NEWS_STATUS_CHANGED,entityType:AUDIT_ENTITY_TYPES.NEWS,entityId:String(row.id),entityTitle:String(row.title),module:'news',workspace:locale,result:'success',after:{published}},sql);});}
export async function setNewsPlacement(locale:NewsLocale,id:number,placement:'hot'|'home',enabled:boolean,actor:CmsPrincipal){return withTransaction(async(sql)=>{const table=tables(locale).news,column=placement==='hot'?'is_hot':'show_in_homepage';const current=(await sql.unsafe(`SELECT id,title,${column} enabled FROM ${table} WHERE id=$1 FOR UPDATE`,[id]))[0];if(!current)throw new Error('Không tìm thấy bài viết.');if(enabled&&!current.enabled)await assertNewsPlacementCapacity(sql,locale,placement,id);await sql.unsafe(`UPDATE ${table} SET ${column}=$1,updated_time=now() WHERE id=$2`,[enabled,id]);await writeAuditEvent(actor,{action:AUDIT_ACTIONS.NEWS_UPDATED,entityType:AUDIT_ENTITY_TYPES.NEWS,entityId:String(id),entityTitle:String(current.title),module:'news',workspace:locale,result:'success',after:{[column]:enabled}},sql);});}
export async function trashNews(locale:NewsLocale,id:number,actor:CmsPrincipal){return withTransaction(async(sql)=>{const moved=await moveNewsToTrash(sql,locale,id,actor.legacyUserId);await writeAuditEvent(actor,{action:AUDIT_ACTIONS.NEWS_TRASHED,entityType:AUDIT_ENTITY_TYPES.NEWS,entityId:String(id),entityTitle:moved.title,module:'news',workspace:locale,result:'success',after:{trashId:moved.trashId}},sql);return moved;});}
