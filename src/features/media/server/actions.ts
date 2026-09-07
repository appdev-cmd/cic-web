'use server';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'node:crypto';
import { requirePermission } from '@/server/auth/guards';
import { createSupabaseAdminClient } from '@/server/supabase/admin';
import { MEDIA_BUCKET, MEDIA_MAX_FILE_BYTES, type MediaLocale, type MediaType } from '../constants';
import { mediaAlbumInputSchema, mediaFolderInputSchema, mediaIdSchema, mediaMetadataPatchSchema, mediaReplaceRegistrationSchema, mediaUploadRegistrationSchema } from '../schemas/mediaInput';
import { createMediaAsset, createMediaFolder, deleteMediaAlbum, replaceMediaAsset, saveMediaAlbum, trashMediaAssets, updateMediaMetadata } from './repository';
import { getCmsMediaData, getCmsMediaPickerItems } from './queries';

const allowedMime=new Set(['image/jpeg','image/png','image/webp','image/avif','image/gif','image/svg+xml','video/mp4','video/webm','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);
const mediaType=(mime:string):MediaType=>mime.startsWith('image/')?'image':mime.startsWith('video/')?'video':'document';
const safeFilename=(name:string)=>name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/-+/g,'-').slice(-180)||'media-file';
const refresh=()=>{revalidatePath('/cms');revalidatePath('/cms/media');};

async function uploadFile(file:File,locale:MediaLocale) {
  if(!allowedMime.has(file.type))throw new Error('Định dạng tệp không được hỗ trợ.');
  if(file.size<=0||file.size>MEDIA_MAX_FILE_BYTES)throw new Error('Tệp phải có dung lượng từ 1 byte đến 100 MiB.');
  const path=`${locale}/${new Date().toISOString().slice(0,7)}/${randomUUID()}-${safeFilename(file.name)}`;
  const {error}=await createSupabaseAdminClient().storage.from(MEDIA_BUCKET).upload(path,file,{contentType:file.type,upsert:false,cacheControl:'3600'});
  if(error)throw new Error('Không thể tải tệp lên kho Media.'); return path;
}
export async function refreshMediaAction(locale:MediaLocale){return getCmsMediaData(locale);}
export async function getMediaPickerItemsAction(locale:MediaLocale){return getCmsMediaPickerItems(locale);}
export async function uploadMediaAction(formData:FormData) {
  const actor=await requirePermission('media','create'); const file=formData.get('file'); if(!(file instanceof File))throw new Error('Vui lòng chọn tệp cần tải lên.');
  const locale=formData.get('locale')==='en'?'en':'vi'; const path=await uploadFile(file,locale);
  try{const input=mediaUploadRegistrationSchema.parse({storagePath:path,filename:file.name,mimeType:file.type,fileSizeBytes:file.size,mediaType:mediaType(file.type),locale,title:String(formData.get('title')||file.name),altText:String(formData.get('altText')||''),folderId:formData.get('folderId')||null}); const result=await createMediaAsset(input,actor);refresh();return result;}
  catch(error){await createSupabaseAdminClient().storage.from(MEDIA_BUCKET).remove([path]);throw error;}
}
export async function updateMediaMetadataAction(rawId:unknown,payload:unknown){const actor=await requirePermission('media','edit');await updateMediaMetadata(mediaIdSchema.parse(rawId),mediaMetadataPatchSchema.parse(payload),actor);refresh();}
export async function createMediaFolderAction(payload:unknown){const actor=await requirePermission('media','edit');const result=await createMediaFolder(mediaFolderInputSchema.parse(payload),actor);refresh();return result;}
export async function saveMediaAlbumAction(rawId:unknown,payload:unknown){const actor=await requirePermission('media',rawId?'edit':'create');const id=rawId?mediaIdSchema.parse(rawId):null;const result=await saveMediaAlbum(id,mediaAlbumInputSchema.parse(payload),actor);refresh();return result;}
export async function deleteMediaAlbumAction(rawId:unknown){const actor=await requirePermission('media','delete');await deleteMediaAlbum(mediaIdSchema.parse(rawId),actor);refresh();}
export async function trashMediaAssetsAction(rawIds:unknown){const actor=await requirePermission('media','delete');const ids=Array.isArray(rawIds)?rawIds.map((id)=>mediaIdSchema.parse(id)):[];if(!ids.length||ids.length>100)throw new Error('Vui lòng chọn từ 1 đến 100 tệp.');await trashMediaAssets([...new Set(ids)],actor);refresh();}
export async function replaceMediaAssetAction(rawId:unknown,formData:FormData){const actor=await requirePermission('media','replace');const id=mediaIdSchema.parse(rawId);const file=formData.get('file');if(!(file instanceof File))throw new Error('Vui lòng chọn tệp thay thế.');const locale=formData.get('locale')==='en'?'en':'vi';const path=await uploadFile(file,locale);try{const input=mediaReplaceRegistrationSchema.parse({storagePath:path,filename:file.name,mimeType:file.type,fileSizeBytes:file.size,note:String(formData.get('note')||'Thay thế tệp'),width:null,height:null,durationSeconds:null});await replaceMediaAsset(id,input,actor);refresh();}catch(error){await createSupabaseAdminClient().storage.from(MEDIA_BUCKET).remove([path]);throw error;}}
