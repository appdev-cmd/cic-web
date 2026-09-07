import assert from 'node:assert/strict';
import { getPostgresClient } from '../src/server/db/postgres.ts';
import { saveProductCategory,trashProductCategory } from '../src/features/product-categories/server/repository.ts';
import { listPublishedProductCategories } from '../src/features/product-categories/server/queries.ts';
import { restoreTrashRecord } from '../src/features/trash/server/repository.ts';
import type { CmsPrincipal } from '../src/server/auth/guards.ts';

const sql=getPostgresClient(),marker=`category-roundtrip-${Date.now()}`;let categoryId='',trashId='';
const permissionRows=await sql`SELECT list_function FROM cic_permission_tasks WHERE lower(module)='product_settings' AND published=true`;
assert.ok(permissionRows.length>0,'product_settings permission task is missing');
await sql`DELETE FROM cic_trash_items WHERE status='restored' AND title_snapshot LIKE 'Danh mục kiểm thử roundtrip%'`;
const[actorRow]=await sql`SELECT id FROM cic_users ORDER BY id LIMIT 1`;if(!actorRow)throw new Error('Roundtrip requires one existing CMS actor.');
const actor={legacyUserId:Number(actorRow.id),fullName:'Product category verifier',username:'verifier',email:'',isAdministrator:true,roleCodes:['superadmin'],permissions:[],authUser:{} as CmsPrincipal['authUser']} satisfies CmsPrincipal;
try{
 const created=await saveProductCategory('vi',null,{name:'Danh mục kiểm thử roundtrip',alias:marker,description:'Bản ghi tự động, sẽ được dọn.',parentId:null,ordering:999999,published:false},actor);categoryId=created.id;
 assert.equal((await listPublishedProductCategories('vi')).some(item=>item.id===categoryId),false,'draft leaked to public projection');
 await saveProductCategory('vi',Number(categoryId),{name:'Danh mục kiểm thử roundtrip đã cập nhật',alias:marker,description:'Published verification',parentId:null,ordering:999999,published:true},actor);
 assert.equal((await listPublishedProductCategories('vi')).some(item=>item.id===categoryId),true,'published category missing from public projection');
 const moved=await trashProductCategory('vi',Number(categoryId),actor);trashId=moved.trashId;
 assert.equal((await listPublishedProductCategories('vi')).some(item=>item.id===categoryId),false,'trashed category leaked to public projection');
 await restoreTrashRecord(trashId,'as_draft',actor);
 const[restored]=await sql`SELECT published,name FROM cic_products_categories WHERE id=${Number(categoryId)}`;assert.equal(restored.published,false);assert.equal(String(restored.name),'Danh mục kiểm thử roundtrip đã cập nhật');
 const events=await sql`SELECT action_code FROM cic_activity_logs WHERE entity_type='product_category' AND entity_id=${categoryId}`;assert.ok(events.length>=3,'audit events missing');
 console.log(JSON.stringify({created:true,draftHidden:true,publishedVisible:true,trashHidden:true,restoredInactive:true,audit:true},null,2));
}finally{
 if(categoryId)await sql`DELETE FROM cic_products_categories WHERE id=${Number(categoryId)}`;
 if(trashId)await sql`DELETE FROM cic_trash_items WHERE id=${trashId}`;
 await sql.end();
}
