import assert from 'node:assert/strict';
import { getPostgresClient } from '../src/server/db/postgres.ts';
import { saveNewsCategory,setNewsCategoryPublished,trashNewsCategory } from '../src/features/news-categories/server/repository.ts';
import { listPublishedNewsCategories } from '../src/features/news-categories/server/queries.ts';
import { restoreTrashRecord } from '../src/features/trash/server/repository.ts';
import type { CmsPrincipal } from '../src/server/auth/guards.ts';

const sql=getPostgresClient(),marker=`news-category-roundtrip-${Date.now()}`;let categoryId='',trashId='';
const[actorRow]=await sql`SELECT id FROM cic_users ORDER BY id LIMIT 1`;if(!actorRow)throw new Error('Roundtrip cần một CMS actor hiện có.');
const actor={legacyUserId:Number(actorRow.id),fullName:'News category verifier',username:'verifier',email:'',isAdministrator:true,roleCodes:['superadmin'],permissions:[],authUser:{} as CmsPrincipal['authUser']} satisfies CmsPrincipal;
const input={name:'Danh mục tin kiểm thử roundtrip',title:'Tiêu đề kiểm thử',alias:marker,summary:'Bản ghi tự động sẽ được dọn.',parentId:null,ordering:999999,image:null,published:false,showInHomepage:false,seoTitle:'SEO kiểm thử',seoKeyword:'kiem thu',seoDescription:'SEO description kiểm thử'};
try{
 const created=await saveNewsCategory('vi',null,input,actor);categoryId=created.id;
 await sql`UPDATE cic_news_categories SET icon='legacy-preserved' WHERE id=${Number(categoryId)}`;
 assert.equal((await listPublishedNewsCategories('vi')).some(item=>item.id===categoryId),false,'draft leaked to public projection');
 await saveNewsCategory('vi',Number(categoryId),{...input,name:'Danh mục tin kiểm thử đã cập nhật'},actor);
 const[afterPatch]=await sql`SELECT icon FROM cic_news_categories WHERE id=${Number(categoryId)}`;assert.equal(afterPatch.icon,'legacy-preserved','PATCH overwrote a legacy field');
 await setNewsCategoryPublished('vi',Number(categoryId),true,actor);
 assert.equal((await listPublishedNewsCategories('vi')).some(item=>item.id===categoryId),true,'published category missing from public projection');
 const moved=await trashNewsCategory('vi',Number(categoryId),actor);trashId=moved.trashId;
 assert.equal((await listPublishedNewsCategories('vi')).some(item=>item.id===categoryId),false,'trashed category leaked to public projection');
 await restoreTrashRecord(trashId,'as_draft',actor);
 const[restored]=await sql`SELECT published,show_in_homepage,icon,name FROM cic_news_categories WHERE id=${Number(categoryId)}`;assert.equal(restored.published,false);assert.equal(restored.show_in_homepage,false);assert.equal(restored.icon,'legacy-preserved');assert.equal(restored.name,'Danh mục tin kiểm thử đã cập nhật');
 const events=await sql`SELECT action_code FROM cic_activity_logs WHERE entity_type='news_category' AND entity_id=${categoryId}`;assert.ok(events.length>=4,'audit events missing');
 console.log(JSON.stringify({created:true,draftHidden:true,patchPreservedLegacy:true,publishedVisible:true,trashHidden:true,restoredInactive:true,audit:true},null,2));
}finally{if(categoryId)await sql`DELETE FROM cic_news_categories WHERE id=${Number(categoryId)}`;if(trashId)await sql`DELETE FROM cic_trash_items WHERE id=${trashId}`;await sql.end();}
