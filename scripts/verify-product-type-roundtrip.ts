import assert from 'node:assert/strict';
import { getPostgresClient } from '../src/server/db/postgres.ts';
import { saveProductType, trashProductType } from '../src/features/product-types/server/repository.ts';
import { listPublishedProductTypes } from '../src/features/product-types/server/queries.ts';
import { listPublishedProductsForReference } from '../src/features/products/server/queries.ts';
import { restoreTrashRecord } from '../src/features/trash/server/repository.ts';
import type { CmsPrincipal } from '../src/server/auth/guards.ts';

const sql=getPostgresClient(); const marker=`product-type-roundtrip-${Date.now()}`; let typeId=''; let trashId=''; let productId:number|null=null; let priorTypeId:number|null=null; let priorTypeName:string|null=null;
const [actorRow]=await sql`SELECT id FROM cic_users ORDER BY id LIMIT 1`; if(!actorRow) throw new Error('Roundtrip requires one CMS actor.');
const actor={legacyUserId:Number(actorRow.id),fullName:'Product type verifier',username:'verifier',email:'',isAdministrator:true,roleCodes:['superadmin'],permissions:[],authUser:{} as CmsPrincipal['authUser']} satisfies CmsPrincipal;
try {
  const created=await saveProductType('vi',null,{name:'Loại kiểm thử',alias:marker,ordering:999999,published:false},actor); typeId=created.id;
  await sql`UPDATE cic_products_types SET image='legacy-image-sentinel.svg',description='legacy sentinel',tablenames='legacy_table' WHERE id=${Number(typeId)}`;
  assert.equal((await listPublishedProductTypes('vi')).some(item=>item.id===typeId),false);
  await saveProductType('vi',Number(typeId),{name:'Loại kiểm thử đã cập nhật',alias:marker,ordering:999999,published:true},actor);
  const [patched]=await sql`SELECT image,description,tablenames FROM cic_products_types WHERE id=${Number(typeId)}`;
  assert.equal(String(patched.image),'legacy-image-sentinel.svg'); assert.equal(String(patched.description),'legacy sentinel'); assert.equal(String(patched.tablenames),'legacy_table');
  assert.equal((await listPublishedProductTypes('vi')).some(item=>item.id===typeId),true);
  const [product]=await sql`SELECT id,types_id,types_name FROM cic_products WHERE published=true ORDER BY id LIMIT 1`; assert.ok(product); productId=Number(product.id); priorTypeId=product.types_id==null?null:Number(product.types_id); priorTypeName=product.types_name==null?null:String(product.types_name);
  await sql`UPDATE cic_products SET types_id=${Number(typeId)},types_name='stale legacy label' WHERE id=${productId}`;
  const publicProduct=(await listPublishedProductsForReference()).find(item=>item.id===productId); assert.equal(publicProduct?.productType,'Loại kiểm thử đã cập nhật');
  await assert.rejects(()=>trashProductType('vi',Number(typeId),actor),/sản phẩm sử dụng/);
  await sql`UPDATE cic_products SET types_id=${priorTypeId},types_name=${priorTypeName} WHERE id=${productId}`; productId=null;
  const moved=await trashProductType('vi',Number(typeId),actor); trashId=moved.trashId;
  await restoreTrashRecord(trashId,'as_draft',actor);
  const [restored]=await sql`SELECT published,image,description,tablenames FROM cic_products_types WHERE id=${Number(typeId)}`;
  assert.equal(restored.published,false); assert.equal(String(restored.image),'legacy-image-sentinel.svg'); assert.equal(String(restored.description),'legacy sentinel'); assert.equal(String(restored.tablenames),'legacy_table');
  const events=await sql`SELECT action_code FROM cic_activity_logs WHERE entity_type='product_type' AND entity_id=${typeId}`; assert.ok(events.length>=3);
  console.log(JSON.stringify({created:true,draftHidden:true,publishedVisible:true,publicUsesTypesId:true,referencedTrashBlocked:true,restoredInactive:true,legacyFieldsPreserved:true,audit:true},null,2));
} finally {
  if(productId!==null&&typeId) await sql`UPDATE cic_products SET types_id=${priorTypeId},types_name=${priorTypeName} WHERE id=${productId}`;
  if(typeId) await sql`DELETE FROM cic_products_types WHERE id=${Number(typeId)}`;
  if(trashId) await sql`DELETE FROM cic_trash_items WHERE id=${trashId}`;
  await sql.end();
}
