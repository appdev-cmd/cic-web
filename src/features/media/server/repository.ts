import 'server-only';
import type { Sql } from 'postgres';
import type { CmsPrincipal } from '@/server/auth/guards';
import { withTransaction } from '@/server/db/postgres';
import { writeAuditEvent } from '@/server/audit/writer';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import type { MediaAlbumInput, MediaMetadataPatch, MediaUploadRegistration } from '../schemas/mediaInput';
import { mediaTrashSnapshotSchema } from './trash-contract';

export async function createMediaAsset(input:MediaUploadRegistration,actor:CmsPrincipal) {
  return withTransaction(async(sql)=>{
    const [asset]=await sql`INSERT INTO cic_media_assets (filename,media_type,mime_type,storage_path,file_size_bytes,width,height,duration_seconds,workflow_status,created_by) VALUES (${input.filename},${input.mediaType},${input.mimeType},${input.storagePath},${input.fileSizeBytes},${input.width??null},${input.height??null},${input.durationSeconds??null},'ready',${actor.legacyUserId}) RETURNING id`;
    const id=Number(asset.id);
    await sql`INSERT INTO cic_media_asset_translations (asset_id,locale,title,alt_text,updated_by) VALUES (${id},${input.locale},${input.title},${input.altText},${actor.legacyUserId})`;
    if(input.folderId) await sql`INSERT INTO cic_media_folder_assets (folder_id,asset_id,ordering) SELECT ${input.folderId},${id},coalesce(max(ordering),-1)+1 FROM cic_media_folder_assets WHERE folder_id=${input.folderId}`;
    await writeAuditEvent(actor,{action:AUDIT_ACTIONS.MEDIA_CREATED,entityType:AUDIT_ENTITY_TYPES.MEDIA_ASSET,entityId:String(id),entityTitle:input.title,module:'media',workspace:input.locale,result:'success',after:{filename:input.filename,mediaType:input.mediaType,mimeType:input.mimeType,fileSizeBytes:input.fileSizeBytes}},sql);
    return {id:String(id)};
  });
}

export async function updateMediaMetadata(id:number,input:MediaMetadataPatch,actor:CmsPrincipal) {
  return withTransaction(async(sql)=>{
    const [before]=await sql`SELECT a.filename,a.credit_author,a.license_type,a.license_expiry,a.tags,t.title,t.description,t.alt_text,t.caption FROM cic_media_assets a LEFT JOIN cic_media_asset_translations t ON t.asset_id=a.id AND t.locale=${input.locale} WHERE a.id=${id} AND a.deleted_at IS NULL FOR UPDATE OF a`;
    if(!before) throw new Error('Không tìm thấy tệp Media.');
    await sql`UPDATE cic_media_assets SET credit_author=${input.creditAuthor??null},license_type=${input.licenseType??null},license_expiry=${input.licenseExpiry??null},tags=${sql.array([...new Set(input.tags)])}::text[],updated_at=now() WHERE id=${id}`;
    await sql`INSERT INTO cic_media_asset_translations (asset_id,locale,title,description,alt_text,caption,updated_at,updated_by) VALUES (${id},${input.locale},${input.title},${input.description??null},${input.altText},${input.caption??null},now(),${actor.legacyUserId}) ON CONFLICT (asset_id,locale) DO UPDATE SET title=excluded.title,description=excluded.description,alt_text=excluded.alt_text,caption=excluded.caption,updated_at=now(),updated_by=excluded.updated_by`;
    await sql`DELETE FROM cic_media_folder_assets fa USING cic_media_folders f WHERE fa.folder_id=f.id AND fa.asset_id=${id} AND f.workspace=${input.locale}`;
    if(input.folderId) await sql`INSERT INTO cic_media_folder_assets (folder_id,asset_id,ordering) SELECT ${input.folderId},${id},coalesce(max(ordering),-1)+1 FROM cic_media_folder_assets WHERE folder_id=${input.folderId}`;
    await writeAuditEvent(actor,{action:AUDIT_ACTIONS.MEDIA_UPDATED,entityType:AUDIT_ENTITY_TYPES.MEDIA_ASSET,entityId:String(id),entityTitle:input.title,module:'media',workspace:input.locale,result:'success',before,after:{title:input.title,description:input.description,altText:input.altText,caption:input.caption,creditAuthor:input.creditAuthor,licenseType:input.licenseType,licenseExpiry:input.licenseExpiry,tags:input.tags,folderId:input.folderId}},sql);
  });
}

export async function replaceMediaAsset(id:number,input:{storagePath:string;filename:string;mimeType:string;fileSizeBytes:number;width?:number|null;height?:number|null;durationSeconds?:number|null;note:string},actor:CmsPrincipal) {
  return withTransaction(async(sql)=>{
    const [row]=await sql`SELECT id,filename,storage_path,file_size_bytes,workflow_status FROM cic_media_assets WHERE id=${id} AND deleted_at IS NULL FOR UPDATE`;
    if(!row) throw new Error('Không tìm thấy tệp Media.');
    const [version]=await sql`SELECT coalesce(max(version_number),0)+1 next FROM cic_media_versions WHERE asset_id=${id}`;
    await sql`INSERT INTO cic_media_versions (asset_id,version_number,filename,storage_path,file_size_bytes,replacement_note,created_by) VALUES (${id},${Number(version.next)},${String(row.filename)},${String(row.storage_path)},${Number(row.file_size_bytes)},${input.note},${actor.legacyUserId})`;
    await sql`UPDATE cic_media_assets SET filename=${input.filename},mime_type=${input.mimeType},storage_path=${input.storagePath},thumbnail_path=NULL,file_size_bytes=${input.fileSizeBytes},width=${input.width??null},height=${input.height??null},duration_seconds=${input.durationSeconds??null},updated_at=now() WHERE id=${id}`;
    await writeAuditEvent(actor,{action:AUDIT_ACTIONS.MEDIA_REPLACED,entityType:AUDIT_ENTITY_TYPES.MEDIA_ASSET,entityId:String(id),entityTitle:input.filename,module:'media',workspace:'global',result:'success',before:{filename:row.filename,storagePath:row.storage_path,fileSizeBytes:row.file_size_bytes},after:{filename:input.filename,storagePath:input.storagePath,fileSizeBytes:input.fileSizeBytes,note:input.note,version:Number(version.next)}},sql);
  });
}

export async function createMediaFolder(input:{workspace:'vi'|'en';name:string;alias:string},actor:CmsPrincipal) {
  return withTransaction(async(sql)=>{
    const [row]=await sql`INSERT INTO cic_media_folders (workspace,name,alias,ordering) SELECT ${input.workspace},${input.name},${input.alias},coalesce(max(ordering),-1)+1 FROM cic_media_folders WHERE workspace=${input.workspace} RETURNING id`;
    const id=String(row.id);
    await writeAuditEvent(actor,{action:AUDIT_ACTIONS.MEDIA_FOLDER_CREATED,entityType:AUDIT_ENTITY_TYPES.MEDIA_FOLDER,entityId:id,entityTitle:input.name,module:'media',workspace:input.workspace,result:'success',after:{name:input.name,alias:input.alias}},sql);
    return {id};
  });
}

async function syncAlbumItems(sql:Sql,albumId:number,input:MediaAlbumInput) {
  const ids=[...new Set(input.assetIds)];
  if(ids.length){const existing=await sql`SELECT id FROM cic_media_assets WHERE id IN ${sql(ids)} AND deleted_at IS NULL`; if(existing.length!==ids.length) throw new Error('Một hoặc nhiều tệp trong Album không còn tồn tại.');}
  if(input.coverAssetId&&!ids.includes(input.coverAssetId)) throw new Error('Ảnh bìa phải thuộc Album.');
  await sql`DELETE FROM cic_media_album_assets WHERE album_id=${albumId}`;
  for(const [index,assetId] of ids.entries()) await sql`INSERT INTO cic_media_album_assets (album_id,asset_id,position) VALUES (${albumId},${assetId},${index+1})`;
}

export async function saveMediaAlbum(id:number|null,input:MediaAlbumInput,actor:CmsPrincipal) {
  return withTransaction(async(sql)=>{
    let albumId=id; let action:typeof AUDIT_ACTIONS.MEDIA_ALBUM_UPDATED|typeof AUDIT_ACTIONS.MEDIA_ALBUM_CREATED= AUDIT_ACTIONS.MEDIA_ALBUM_UPDATED;
    if(id){const [row]=await sql`UPDATE cic_media_albums SET title=${input.title},alias=${input.alias},description=${input.description},cover_asset_id=${input.coverAssetId},workflow_status=${input.workflowStatus},updated_at=now() WHERE id=${id} AND workspace=${input.workspace} RETURNING id`; if(!row)throw new Error('Không tìm thấy Album.');}
    else {const [row]=await sql`INSERT INTO cic_media_albums (workspace,title,alias,description,cover_asset_id,workflow_status,ordering,created_by) SELECT ${input.workspace},${input.title},${input.alias},${input.description},${input.coverAssetId},${input.workflowStatus},coalesce(max(ordering),-1)+1,${actor.legacyUserId} FROM cic_media_albums WHERE workspace=${input.workspace} RETURNING id`; albumId=Number(row.id); action=AUDIT_ACTIONS.MEDIA_ALBUM_CREATED;}
    await syncAlbumItems(sql,albumId!,input);
    await writeAuditEvent(actor,{action,entityType:AUDIT_ENTITY_TYPES.MEDIA_ALBUM,entityId:String(albumId),entityTitle:input.title,module:'media',workspace:input.workspace,result:'success',after:{alias:input.alias,status:input.workflowStatus,coverAssetId:input.coverAssetId,assetIds:input.assetIds}},sql);
    return {id:String(albumId)};
  });
}

export async function deleteMediaAlbum(id:number,actor:CmsPrincipal) {
  return withTransaction(async(sql)=>{const [row]=await sql`DELETE FROM cic_media_albums WHERE id=${id} RETURNING title,workspace`; if(!row)throw new Error('Không tìm thấy Album.'); await writeAuditEvent(actor,{action:AUDIT_ACTIONS.MEDIA_ALBUM_DELETED,entityType:AUDIT_ENTITY_TYPES.MEDIA_ALBUM,entityId:String(id),entityTitle:String(row.title),module:'media',workspace:row.workspace==='en'?'en':'vi',result:'success'},sql);});
}

export async function moveMediaAssetToTrash(sql:Sql,id:number,actorId:number) {
  const [row]=await sql`SELECT id,filename,media_type,storage_path,thumbnail_path,workflow_status FROM cic_media_assets WHERE id=${id} AND deleted_at IS NULL FOR UPDATE`; if(!row)throw new Error('Không tìm thấy tệp Media.');
  const translations=await sql`SELECT locale,title,description,alt_text,caption FROM cic_media_asset_translations WHERE asset_id=${id}`;
  const folders=await sql`SELECT folder_id,ordering FROM cic_media_folder_assets WHERE asset_id=${id}`; const albums=await sql`SELECT album_id,position FROM cic_media_album_assets WHERE asset_id=${id}`;
  const snapshot=mediaTrashSnapshotSchema.parse({version:1,assetId:String(id),filename:String(row.filename),mediaType:row.media_type,storagePath:row.storage_path,thumbnailPath:row.thumbnail_path,workflowStatus:row.workflow_status,translations:translations.map((t)=>({locale:t.locale,title:t.title,description:t.description,altText:t.alt_text,caption:t.caption})),folders:folders.map((f)=>({folderId:String(f.folder_id),ordering:Number(f.ordering)})),albums:albums.map((a)=>({albumId:String(a.album_id),position:Number(a.position)}))});
  const [trash]=await sql`INSERT INTO cic_trash_items (workspace,entity_type,entity_id,module,title_snapshot,payload_snapshot,status,deleted_by,purge_after,restore_state) VALUES ('global','media_asset',${String(id)},'media',${String(translations[0]?.title??row.filename)},${sql.json(snapshot as never)},'trashed',${actorId},now()+interval '30 days','inactive') RETURNING id`;
  await sql`UPDATE cic_media_assets SET deleted_at=now(),workflow_status='archived',updated_at=now() WHERE id=${id}`;
  return {trashId:String(trash.id),title:String(translations[0]?.title??row.filename)};
}

export async function trashMediaAssets(ids:number[],actor:CmsPrincipal) {return withTransaction(async(sql)=>{for(const id of ids){const moved=await moveMediaAssetToTrash(sql,id,actor.legacyUserId); await writeAuditEvent(actor,{action:AUDIT_ACTIONS.MEDIA_TRASHED,entityType:AUDIT_ENTITY_TYPES.MEDIA_ASSET,entityId:String(id),entityTitle:moved.title,module:'media',workspace:'global',result:'success',after:{trashId:moved.trashId,state:'trashed'}},sql);}});}
