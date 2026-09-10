import 'server-only';
import type { Sql } from 'postgres';
import { z } from 'zod';
import type { NewsLocale } from '@/features/news/server/placement';
import type { TrashEntityAdapter, TrashInspection } from '../registry-types';
import type { TrashRestoreMode } from '../../types';

const snapshotSchema=z.object({version:z.literal(1),locale:z.enum(['vi','en']),record:z.record(z.string(),z.unknown())});
const table=(locale:NewsLocale)=>locale==='en'?'cic_news_en':'cic_news';

export async function moveNewsToTrash(sql:Sql,locale:NewsLocale,id:number,actorId:number){
  const source=table(locale);const [row]=await sql.unsafe(`SELECT to_jsonb(n) record FROM ${source} n WHERE id=$1 FOR UPDATE`,[id]);
  if(!row)throw new Error('Không tìm thấy bài viết.');
  const snapshot=snapshotSchema.parse({version:1,locale,record:row.record});
  const [trash]=await sql`INSERT INTO cic_trash_items(workspace,entity_type,entity_id,module,title_snapshot,payload_snapshot,original_url,status,deleted_by,purge_after,restore_state) VALUES(${locale},${locale==='en'?'news_en':'news'},${String(id)},'news',${String(snapshot.record.title??id)},${sql.json(snapshot as never)},${`/news/${snapshot.record.alias??id}`},'trashed',${actorId},now()+interval '30 days','draft') RETURNING id`;
  await sql.unsafe(`DELETE FROM ${source} WHERE id=$1`,[id]);return{trashId:String(trash.id),title:String(snapshot.record.title??id)};
}
async function inspect(sql:Sql,raw:unknown):Promise<TrashInspection>{const parsed=snapshotSchema.safeParse(raw);if(!parsed.success)return{status:'schema_mismatch',details:'Snapshot Tin tức không hợp lệ.',restoreModes:[]};const source=table(parsed.data.locale),id=Number(parsed.data.record.id),alias=String(parsed.data.record.alias??'');if((await sql.unsafe(`SELECT 1 FROM ${source} WHERE id=$1`,[id])).length)return{status:'conflict',details:'ID bài viết đã được sử dụng.',restoreModes:[]};if((await sql.unsafe(`SELECT 1 FROM ${source} WHERE lower(btrim(alias))=lower(btrim($1))`,[alias])).length)return{status:'conflict',details:'Alias bài viết đã được sử dụng.',restoreModes:[]};return{status:'clear',details:'Sẵn sàng phục hồi về bản nháp.',restoreModes:['as_draft']};}
async function restore(sql:Sql,raw:unknown,mode:TrashRestoreMode){const snapshot=snapshotSchema.parse(raw),check=await inspect(sql,snapshot);if(!check.restoreModes.includes(mode))throw new Error(check.details);const source=table(snapshot.locale);const record:Record<string,unknown>={...snapshot.record,published:false,is_hot:false,show_in_homepage:false,updated_time:new Date().toISOString()};const columns=Object.keys(record);if(columns.some((column)=>!/^[_a-z][_a-z0-9]*$/i.test(column)))throw new Error('Snapshot Tin tức chứa tên cột không hợp lệ.');await sql.unsafe(`INSERT INTO ${source} (${columns.map((column)=>`"${column}"`).join(',')}) OVERRIDING SYSTEM VALUE VALUES (${columns.map((_,index)=>`$${index+1}`).join(',')})`,columns.map((column)=>(record[column]??null) as never));return{title:String(record.title??record.id),restoredEntityId:String(record.id),restoredState:'draft' as const};}
const adapter=(locale:NewsLocale):TrashEntityAdapter=>({entityType:locale==='en'?'news_en':'news',module:'news',label:'Tin tức',itemType:'Bài viết',workspace:locale,restoreState:'draft',supportsPurge:true,getRevalidationTargets:()=>[{path:'/cms/news'},{path:'/news'},{path:'/news/[slug]',type:'page'}],parseSnapshot:(value)=>snapshotSchema.parse(value),inspect,restore,purge:async()=>undefined,presentSnapshot:(value)=>{const snapshot=snapshotSchema.parse(value);return{version:snapshot.version,title:snapshot.record.title,slug:snapshot.record.alias,categoryId:snapshot.record.category_id,published:snapshot.record.published};}});
export const newsTrashAdapter=adapter('vi');
export const newsEnTrashAdapter=adapter('en');
