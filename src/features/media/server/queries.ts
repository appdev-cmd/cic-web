import 'server-only';
import { requirePermission } from '@/server/auth/guards';
import { getPostgresClient } from '@/server/db/postgres';
import type { MediaLocale } from '../constants';
import type { CmsMediaPickerItem, MediaAlbum, MediaAsset, MediaFolder, MediaIssue, MediaModuleData } from '../types';
import { createMediaSignedUrls } from './storage';

type Row = Record<string, unknown>;
const str = (value: unknown) => value == null ? '' : String(value);
const opt = (value: unknown) => value == null ? undefined : String(value);
const num = (value: unknown) => value == null ? undefined : Number(value);
const rows = (value: unknown): Row[] => Array.isArray(value) ? value as Row[] : [];

async function queryMediaRows(locale: MediaLocale) {
  const sql = getPostgresClient();
  return Promise.all([
    sql`SELECT a.id,a.filename,a.media_type,a.mime_type,a.storage_path,a.thumbnail_path,a.file_size_bytes,a.width,a.height,a.duration_seconds,a.credit_author,a.license_type,a.license_expiry,a.tags,a.workflow_status,a.created_at,a.updated_at,a.deleted_at,t.title,t.description,t.alt_text,t.caption,u.full_name owner_name,u.image owner_avatar,
      coalesce((SELECT jsonb_agg(jsonb_build_object('id',f.id,'name',f.name,'ordering',fa.ordering) ORDER BY fa.ordering,f.id) FROM cic_media_folder_assets fa JOIN cic_media_folders f ON f.id=fa.folder_id WHERE fa.asset_id=a.id AND f.workspace=${locale}),'[]'::jsonb) folders,
      coalesce((SELECT jsonb_agg(jsonb_build_object('album_id',aa.album_id,'position',aa.position) ORDER BY aa.album_id,aa.position) FROM cic_media_album_assets aa JOIN cic_media_albums al ON al.id=aa.album_id WHERE aa.asset_id=a.id AND al.workspace=${locale}),'[]'::jsonb) albums,
      coalesce((SELECT jsonb_agg(jsonb_build_object('id',v.id,'version_number',v.version_number,'filename',v.filename,'storage_path',v.storage_path,'file_size_bytes',v.file_size_bytes,'note',v.replacement_note,'created_at',v.created_at) ORDER BY v.version_number DESC) FROM cic_media_versions v WHERE v.asset_id=a.id),'[]'::jsonb) versions,
      coalesce((SELECT jsonb_agg(jsonb_build_object('id',v.id,'preset_name',v.preset_name,'width',v.width,'height',v.height,'format',v.format,'storage_path',v.storage_path,'file_size_bytes',v.file_size_bytes,'focal_x',v.focal_x,'focal_y',v.focal_y,'status',v.processing_status) ORDER BY v.preset_name,v.format) FROM cic_media_variants v WHERE v.asset_id=a.id),'[]'::jsonb) variants
      ,coalesce((SELECT jsonb_agg(reference ORDER BY reference->>'updated_at' DESC) FROM (
        SELECT jsonb_build_object('id',c.id::text,'entity_type','cta','entity_title',c.admin_name,'path','/cms/cta','updated_at',c.updated_at::text) reference FROM cic_ctas c WHERE c.media_asset_id=a.id AND c.deleted_at IS NULL
        UNION ALL
        SELECT jsonb_build_object('id',s.id::text,'entity_type','form_submission','entity_title','Tệp tải lên từ biểu mẫu','path',coalesce(s.source_path,'/cms/forms/submissions'),'updated_at',s.submitted_at::text) reference FROM cic_form_submission_values sv JOIN cic_form_submissions s ON s.id=sv.submission_id WHERE sv.media_asset_id=a.id
      ) usage_refs),'[]'::jsonb) used_by_refs
      FROM cic_media_assets a LEFT JOIN cic_media_asset_translations t ON t.asset_id=a.id AND t.locale=${locale} LEFT JOIN cic_users u ON u.id=a.created_by
      WHERE a.deleted_at IS NULL ORDER BY a.updated_at DESC,a.id DESC`,
    sql`SELECT id,name,alias,icon,ordering,(SELECT count(*)::int FROM cic_media_folder_assets fa WHERE fa.folder_id=f.id) asset_count FROM cic_media_folders f WHERE workspace=${locale} ORDER BY ordering,id`,
    sql`SELECT a.id,a.title,a.alias,a.description,a.cover_asset_id,a.workflow_status,a.ordering,a.created_at,a.updated_at,u.full_name owner_name,
      coalesce((SELECT jsonb_agg(aa.asset_id ORDER BY aa.position) FROM cic_media_album_assets aa WHERE aa.album_id=a.id),'[]'::jsonb) asset_ids
      FROM cic_media_albums a LEFT JOIN cic_users u ON u.id=a.created_by WHERE a.workspace=${locale} ORDER BY a.ordering,a.id`,
  ]);
}

function collectPaths(assetRows: Row[]) {
  return assetRows.flatMap((row) => [str(row.storage_path), str(row.thumbnail_path), ...rows(row.versions).map((v)=>str(v.storage_path)), ...rows(row.variants).map((v)=>str(v.storage_path))]);
}

function mapAsset(row: Row, urls: Map<string,string>): MediaAsset {
  const id=str(row.id); const title=str(row.title)||str(row.filename); const alt=str(row.alt_text); const folders=rows(row.folders);
  return {
    id,filename:str(row.filename),title,description:opt(row.description),type:str(row.media_type) as MediaAsset['type'],mime_type:str(row.mime_type),url:urls.get(str(row.storage_path))??'',thumbnail_url:urls.get(str(row.thumbnail_path))||undefined,
    file_size_kb:Math.round(Number(row.file_size_bytes)/1024),width:num(row.width),height:num(row.height),duration_sec:num(row.duration_seconds),alt_text:alt,caption:opt(row.caption),credit_author:opt(row.credit_author),license_type:opt(row.license_type) as MediaAsset['license_type'],license_expiry:opt(row.license_expiry),
    folder_id:folders[0]?str(folders[0].id):'',folder_name:folders[0]?str(folders[0].name):'Chưa phân loại',album_ids:rows(row.albums).map((v)=>str(v.album_id)),tags:Array.isArray(row.tags)?row.tags.map(String):[],used_by_count:rows(row.used_by_refs).length,used_by_refs:rows(row.used_by_refs).map((v)=>({id:str(v.id),entity_type:str(v.entity_type) as MediaAsset['used_by_refs'][number]['entity_type'],entity_title:str(v.entity_title),path:str(v.path),updated_at:str(v.updated_at)})),workflow_status:str(row.workflow_status) as MediaAsset['workflow_status'],metadata_status:alt&&title?'complete':'incomplete',
    variants:rows(row.variants).map((v)=>({id:str(v.id),preset_name:str(v.preset_name) as never,width:Number(v.width),height:Number(v.height),format:str(v.format) as never,file_size_kb:Math.round(Number(v.file_size_bytes)/1024),url:urls.get(str(v.storage_path))??'',focal_point:v.focal_x==null||v.focal_y==null?undefined:{x:Number(v.focal_x),y:Number(v.focal_y)},status:str(v.status) as never})),
    versions:rows(row.versions).map((v)=>({version_number:Number(v.version_number),filename:str(v.filename),file_size_kb:Math.round(Number(v.file_size_bytes)/1024),replaced_by:'Hệ thống CMS',replaced_at:str(v.created_at),note:str(v.note),url:urls.get(str(v.storage_path))??''})),
    owner_name:str(row.owner_name)||'Hệ thống CMS',owner_avatar:str(row.owner_avatar),created_at:str(row.created_at),updated_at:str(row.updated_at),deleted_at:opt(row.deleted_at),
  };
}

export async function getCmsMediaData(locale: MediaLocale): Promise<MediaModuleData> {
  await requirePermission('media','view');
  const [assetRows,folderRows,albumRows]=await queryMediaRows(locale); const urls=await createMediaSignedUrls(collectPaths(assetRows));
  const assets=assetRows.map((row)=>mapAsset(row,urls)); const assetsById=new Map(assets.map((asset)=>[asset.id,asset]));
  const folders:MediaFolder[]=[{id:'f_all',name:'Tất cả thư mục',code_alias:'all',icon:'Folder',count:assets.length},...folderRows.map((r)=>({id:str(r.id),name:str(r.name),code_alias:str(r.alias),icon:str(r.icon)||'Folder',count:Number(r.asset_count)}))];
  const albums:MediaAlbum[]=albumRows.map((r)=>{const ids=Array.isArray(r.asset_ids)?r.asset_ids.map(String):[]; const cover=assetsById.get(str(r.cover_asset_id)); return {id:str(r.id),title:str(r.title),code_alias:str(r.alias),description:str(r.description),cover_asset_id:opt(r.cover_asset_id),cover_asset_url:cover?.thumbnail_url||cover?.url,asset_ids:ids,item_count:ids.length,display_order:Number(r.ordering),workflow_status:str(r.workflow_status) as MediaAlbum['workflow_status'],owner_name:str(r.owner_name)||'Hệ thống CMS',created_at:str(r.created_at),updated_at:str(r.updated_at)};});
  const issues:MediaIssue[]=assets.flatMap((asset)=>{const list:MediaIssue[]=[]; if(asset.type==='image'&&!asset.alt_text) list.push({id:`missing_alt_${asset.id}`,asset_id:asset.id,asset_name:asset.filename,type:'missing_alt',severity:'medium',message:'Ảnh chưa có nội dung thay thế.',created_at:asset.updated_at}); if(asset.license_expiry&&new Date(asset.license_expiry)<new Date()) list.push({id:`license_${asset.id}`,asset_id:asset.id,asset_name:asset.filename,type:'license_expired',severity:'high',message:'Bản quyền đã hết hạn.',created_at:asset.updated_at}); return list;});
  return {assets,folders,albums,issues};
}

export async function getCmsMediaPickerItems(locale: MediaLocale): Promise<CmsMediaPickerItem[]> {
  const data=await getCmsMediaData(locale); return data.assets.filter((a)=>a.type==='image'&&a.workflow_status==='ready').map(({id,filename,title,url,thumbnail_url})=>({id,filename,title,url,thumbnail_url}));
}

export async function getPublicMediaAsset(assetId:string,locale:MediaLocale) {
  if(!/^\d+$/.test(assetId)) return null; const sql=getPostgresClient();
  const [row]=await sql`SELECT a.id,a.media_type,a.mime_type,a.storage_path,a.thumbnail_path,a.width,a.height,t.title,t.alt_text,t.caption FROM cic_media_assets a LEFT JOIN cic_media_asset_translations t ON t.asset_id=a.id AND t.locale=${locale} WHERE a.id=${Number(assetId)} AND a.workflow_status='ready' AND a.deleted_at IS NULL LIMIT 1`;
  if(!row)return null; const urls=await createMediaSignedUrls([str(row.storage_path),str(row.thumbnail_path)],900); return {id:str(row.id),type:str(row.media_type),mimeType:str(row.mime_type),url:urls.get(str(row.storage_path))??'',thumbnailUrl:urls.get(str(row.thumbnail_path))||undefined,width:num(row.width),height:num(row.height),title:str(row.title),altText:str(row.alt_text),caption:opt(row.caption)};
}
