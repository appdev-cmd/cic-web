import 'server-only';
import type { Sql } from 'postgres';
import type { TrashRestoreMode } from '../../types';
import type { TrashEntityAdapter, TrashInspection } from '../registry-types';
import { mediaTrashSnapshotSchema } from '@/features/media/server/trash-contract';

async function inspect(sql:Sql,value:unknown):Promise<TrashInspection>{const parsed=mediaTrashSnapshotSchema.safeParse(value);if(!parsed.success)return{status:'schema_mismatch',details:'Snapshot Media không đúng phiên bản được hỗ trợ.',restoreModes:[]};const [row]=await sql`SELECT deleted_at FROM cic_media_assets WHERE id=${Number(parsed.data.assetId)}`;if(!row)return{status:'conflict',details:'Bản ghi Media gốc không còn tồn tại; chưa thể phục hồi an toàn.',restoreModes:[]};if(row.deleted_at==null)return{status:'conflict',details:'Tệp Media đã hoạt động, không thể phục hồi trùng.',restoreModes:[]};return{status:'clear',details:'Asset và các quan hệ Media sẵn sàng phục hồi.',restoreModes:['as_draft']};}

export const mediaTrashAdapter:TrashEntityAdapter={
  entityType:'media_asset',module:'media',label:'Thư viện Media',itemType:'Tệp Media',workspace:'global',restoreState:'inactive',supportsPurge:false,
  purgeBlockedReason:'Xóa vĩnh viễn Media chờ Storage cleanup worker để không tạo tệp mồ côi hoặc mất tệp khi transaction thất bại.',
  getRevalidationTargets:operation=>operation==='restore'?[{path:'/cms/media'}]:[],
  parseSnapshot:(value)=>mediaTrashSnapshotSchema.parse(value),inspect,
  restore:async(sql:Sql,value:unknown,mode:TrashRestoreMode)=>{const snapshot=mediaTrashSnapshotSchema.parse(value);const result=await inspect(sql,snapshot);if(!result.restoreModes.includes(mode))throw new Error(result.details);await sql`UPDATE cic_media_assets SET deleted_at=NULL,workflow_status='restricted',updated_at=now() WHERE id=${Number(snapshot.assetId)}`;return{title:snapshot.translations[0]?.title??snapshot.filename,restoredEntityId:snapshot.assetId,restoredState:'inactive'};},
  purge:async()=>undefined,
  presentSnapshot:(value)=>{const snapshot=mediaTrashSnapshotSchema.parse(value);return{version:snapshot.version,filename:snapshot.filename,mediaType:snapshot.mediaType,workflowBeforeDelete:snapshot.workflowStatus,translations:snapshot.translations.length,folderRelations:snapshot.folders.length,albumRelations:snapshot.albums.length,storageCleanup:'pending-worker'};},
};
