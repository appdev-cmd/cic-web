import { randomUUID } from 'node:crypto';
import { config } from 'dotenv';
config({path:'.env.local',override:true,quiet:true});

const [{createSupabaseAdminClient},{createMediaAsset,updateMediaMetadata,trashMediaAssets},{getPublicMediaAsset},{restoreTrashRecord},{getPostgresClient}]=await Promise.all([
  import('../src/server/supabase/admin.ts'),import('../src/features/media/server/repository.ts'),import('../src/features/media/server/queries.ts'),import('../src/features/trash/server/repository.ts'),import('../src/server/db/postgres.ts'),
]);
const sql=getPostgresClient();
const [user]=await sql`SELECT id,email,username,full_name FROM cic_users WHERE lower(email)='admin@cic.com.vn' LIMIT 1`;
if(!user)throw new Error('CMS admin principal is required.');
const actor={legacyUserId:Number(user.id),authUserId:'roundtrip',email:String(user.email),username:String(user.username??'admin'),fullName:String(user.full_name??'Admin'),roleCodes:['superadmin'],permissions:[],isAdministrator:true};
const path=`global/roundtrip/${randomUUID()}-media.svg`; let assetId=''; let trashId='';
const storage=createSupabaseAdminClient().storage.from('cms-media');
try{
  const upload=await storage.upload(path,new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#ea580c"/></svg>'),{contentType:'image/svg+xml'});if(upload.error)throw upload.error;
  const created=await createMediaAsset({storagePath:path,filename:'roundtrip-media.svg',mimeType:'image/svg+xml',fileSizeBytes:116,mediaType:'image',locale:'vi',title:'Media roundtrip',altText:'Hình kiểm thử Media',width:64,height:64,folderId:null},actor);assetId=created.id;
  let publicAsset=await getPublicMediaAsset(assetId,'vi');if(!publicAsset?.url||publicAsset.title!=='Media roundtrip')throw new Error('Public resolver did not expose created ready asset.');
  await updateMediaMetadata(Number(assetId),{locale:'vi',title:'Media roundtrip updated',description:null,altText:'Alt đã cập nhật',caption:null,creditAuthor:null,licenseType:'internal',licenseExpiry:null,tags:['roundtrip'],folderId:null},actor);
  publicAsset=await getPublicMediaAsset(assetId,'vi');if(publicAsset?.title!=='Media roundtrip updated'||publicAsset.altText!=='Alt đã cập nhật')throw new Error('Public resolver did not reflect CMS metadata update.');
  await trashMediaAssets([Number(assetId)],actor);const [trash]=await sql`SELECT id FROM cic_trash_items WHERE entity_type='media_asset' AND entity_id=${assetId} AND status='trashed' ORDER BY deleted_at DESC LIMIT 1`;trashId=String(trash.id);
  if(await getPublicMediaAsset(assetId,'vi'))throw new Error('Trashed asset remained public.');
  await restoreTrashRecord(trashId,'as_draft',actor);if(await getPublicMediaAsset(assetId,'vi'))throw new Error('Restored restricted asset became public without publish.');
  console.log(JSON.stringify({created:true,updated:true,publicReady:true,trashHidden:true,restoredRestricted:true},null,2));
}finally{
  if(assetId){await sql`DELETE FROM cic_media_assets WHERE id=${Number(assetId)}`;}
  if(trashId){await sql`UPDATE cic_trash_items SET status='purged',payload_snapshot='{}'::jsonb,purge_reason='roundtrip cleanup',purged_at=now() WHERE id=${trashId}`;}
  await storage.remove([path]);
  await sql.end({timeout:2});
}
