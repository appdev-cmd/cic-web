import assert from 'node:assert/strict';
import { getPostgresClient } from '../src/server/db/postgres.ts';
import { saveNews,trashNews } from '../src/features/news/server/repository.ts';
import { getPublishedNewsBySlug } from '../src/features/news/server/queries.ts';
import { restoreTrashRecord } from '../src/features/trash/server/repository.ts';
import type { CmsPrincipal } from '../src/server/auth/guards.ts';

const sql=getPostgresClient(),marker=`news-roundtrip-${Date.now()}`;let newsId='',trashId='';
const [actorRow]=await sql`SELECT id FROM cic_users ORDER BY id LIMIT 1`;const [category]=await sql`SELECT id FROM cic_news_categories WHERE published=true ORDER BY id LIMIT 1`;if(!actorRow||!category)throw new Error('Roundtrip requires an actor and category.');
const actor={legacyUserId:Number(actorRow.id),fullName:'News verifier',username:'verifier',email:'',isAdministrator:true,roleCodes:['superadmin'],permissions:[],authUser:{} as CmsPrincipal['authUser']} satisfies CmsPrincipal;
const payload={title:'Tin kiểm thử roundtrip',alias:marker,other_languages1:'',categoryId:Number(category.id),summary:'Tóm tắt kiểm thử',content:'<p>Nội dung kiểm thử an toàn</p>',image:'',video:'',fileUpload:'',tags:['kiểm thử'],relatedNewsIds:[],relatedProductIds:[],startTime:new Date().toISOString(),endTime:'',published:false,isHot:false,showInHomepage:false,ordering:999999,seoTitle:'SEO kiểm thử',seoKeyword:'',seoDescription:'Mô tả SEO',tawkTo:''};
try{
  newsId=(await saveNews('vi',null,payload,actor)).id;await sql`UPDATE cic_news SET source_website='legacy-sentinel' WHERE id=${Number(newsId)}`;
  assert.equal(await getPublishedNewsBySlug(marker),null);
  await saveNews('vi',Number(newsId),{...payload,title:'Tin kiểm thử đã cập nhật',published:true},actor);
  assert.equal((await getPublishedNewsBySlug(marker))?.title,'Tin kiểm thử đã cập nhật');
  const [preserved]=await sql`SELECT source_website FROM cic_news WHERE id=${Number(newsId)}`;assert.equal(preserved.source_website,'legacy-sentinel');
  const moved=await trashNews('vi',Number(newsId),actor);trashId=moved.trashId;assert.equal(await getPublishedNewsBySlug(marker),null);
  await restoreTrashRecord(trashId,'as_draft',actor);const [restored]=await sql`SELECT published,is_hot,show_in_homepage,source_website FROM cic_news WHERE id=${Number(newsId)}`;assert.equal(restored.published,false);assert.equal(restored.is_hot,false);assert.equal(restored.show_in_homepage,false);assert.equal(restored.source_website,'legacy-sentinel');
  const events=await sql`SELECT action_code FROM cic_activity_logs WHERE entity_type='news' AND entity_id=${newsId}`;assert.ok(events.length>=3);
  console.log(JSON.stringify({created:true,draftHidden:true,publishedVisible:true,patchPreservedLegacy:true,trashHidden:true,restoreDraft:true,audit:true},null,2));
}finally{if(newsId)await sql`DELETE FROM cic_news WHERE id=${Number(newsId)}`;if(trashId)await sql`DELETE FROM cic_trash_items WHERE id=${trashId}`;await sql.end();}
