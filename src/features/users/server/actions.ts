'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { User } from '@supabase/supabase-js';
import { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } from '@/server/audit/registry';
import { writeAuditEvent } from '@/server/audit/writer';
import { requirePermission } from '@/server/auth/guards';
import { getPostgresClient } from '@/server/db/postgres';
import { createSupabaseAdminClient } from '@/server/supabase/admin';
import { accountStatusSchema, createUserInputSchema, updateUserInputSchema } from '../schemas/userInput';
import { createUserRecord, trashUserRecord, updateUserRecord, updateUserStatuses, type AuthSyncTarget } from './repository';
import { getCmsUserActivity } from './queries';

const idSchema=z.coerce.number().int().positive();
const refresh=()=>revalidatePath('/cms','layout');
const banDuration=(status:string)=>status==='active'?'none':'876000h';

export async function getCmsUserActivityAction(id:string){return getCmsUserActivity(idSchema.parse(id));}

async function findAuthUser(target:Pick<AuthSyncTarget,'authUserId'|'email'>){
  const admin=createSupabaseAdminClient();
  if(target.authUserId){const {data,error}=await admin.auth.admin.getUserById(target.authUserId);if(!error&&data.user)return {admin,user:data.user};}
  for(let page=1;page<=50;page+=1){
    const {data,error}=await admin.auth.admin.listUsers({page,perPage:100});
    if(error) throw new Error('Không thể đồng bộ tài khoản xác thực.');
    const user=(data.users as User[]).find((item)=>item.email?.toLowerCase()===target.email.toLowerCase());
    if(user)return {admin,user}; if(data.users.length<100)break;
  }
  throw new Error('Không tìm thấy tài khoản xác thực tương ứng.');
}

export async function createCmsUserAction(payload:unknown){
  const actor=await requirePermission('users','create'); const input=createUserInputSchema.parse(payload); const admin=createSupabaseAdminClient();
  const {data,error}=await admin.auth.admin.createUser({email:input.email,password:input.password,email_confirm:true,user_metadata:{username:input.username,full_name:`${input.lname} ${input.fname}`.trim()},app_metadata:{cms_profile:true},ban_duration:banDuration(input.status)});
  if(error||!data.user)throw new Error('Không thể tạo tài khoản xác thực.');
  let id:number;
  try{id=await createUserRecord(input,data.user.id,actor);}
  catch(cause){await admin.auth.admin.deleteUser(data.user.id);throw cause;}
  // The immutable DB bridge is authoritative. Metadata only accelerates auth
  // lookup and must never turn a committed profile into an orphaned account.
  await admin.auth.admin.updateUserById(data.user.id,{app_metadata:{...data.user.app_metadata,cms_profile:true,legacy_user_id:id}});
  refresh();return{id:String(id)};
}

export async function updateCmsUserAction(id:string,payload:unknown){
  const actor=await requirePermission('users','edit'); const input=updateUserInputSchema.parse(payload); const numericId=idSchema.parse(id);
  await updateUserRecord(numericId,input,actor,async(target)=>{
    const {admin,user}=await findAuthUser(target);
    const {error}=await admin.auth.admin.updateUserById(user.id,{email:input.email,password:input.password,user_metadata:{...user.user_metadata,username:input.username,full_name:`${input.lname} ${input.fname}`.trim()},app_metadata:{...user.app_metadata,cms_profile:true,legacy_user_id:numericId},ban_duration:banDuration(input.status)});
    if(error)throw new Error('Không thể đồng bộ tài khoản xác thực; thay đổi hồ sơ đã được hoàn tác.');
    return user.id;
  });
  refresh();return{id};
}

async function syncStatuses(targets:readonly AuthSyncTarget[],status:string){
  const changed:Array<{admin:ReturnType<typeof createSupabaseAdminClient>;user:User;previousStatus:string}>=[];
  try{for(const target of targets){const {admin,user}=await findAuthUser(target);const {error}=await admin.auth.admin.updateUserById(user.id,{ban_duration:banDuration(status),app_metadata:{...user.app_metadata,cms_profile:true,legacy_user_id:target.id}});if(error)throw error;changed.push({admin,user,previousStatus:target.status});}}
  catch{for(const item of changed.reverse())await item.admin.auth.admin.updateUserById(item.user.id,{ban_duration:banDuration(item.previousStatus)});throw new Error('Không thể đồng bộ trạng thái xác thực; thay đổi dữ liệu đã được hoàn tác.');}
}

export async function updateCmsUserStatusAction(id:string,status:unknown,reason:unknown){
  const actor=await requirePermission('users','edit'); const parsedStatus=accountStatusSchema.parse(status); const safeReason=z.string().trim().min(1).max(1000).parse(reason);
  await updateUserStatuses([idSchema.parse(id)],parsedStatus,safeReason,actor,(targets)=>syncStatuses(targets,parsedStatus));refresh();
}

export async function bulkUpdateCmsUserStatusAction(ids:string[],status:unknown){
  const actor=await requirePermission('users','edit'); const parsedIds=z.array(idSchema).min(1).max(100).parse(ids); const parsedStatus=accountStatusSchema.parse(status);
  await updateUserStatuses(parsedIds,parsedStatus,`Cập nhật hàng loạt sang ${parsedStatus}`,actor,(targets)=>syncStatuses(targets,parsedStatus));refresh();
}

export async function sendCmsPasswordResetAction(id:string){
  const actor=await requirePermission('users','edit'); const numericId=idSchema.parse(id); const {admin,user}=await findAuthUser({authUserId:null,email:await getUserEmail(numericId)});
  const {error}=await admin.auth.resetPasswordForEmail(user.email!);if(error)throw new Error('Không thể gửi email khôi phục mật khẩu.');
  await writeAuditEvent(actor,{action:AUDIT_ACTIONS.USER_PASSWORD_RESET_REQUESTED,entityType:AUDIT_ENTITY_TYPES.USER,entityId:String(numericId),entityTitle:String(user.user_metadata?.username??`Tài khoản ${numericId}`),module:'users',workspace:'global',result:'success',metadata:{delivery:'email'}});refresh();
}

async function getUserEmail(id:number){
  const sql=getPostgresClient();const [row]=await sql`SELECT email FROM cic_users u WHERE id=${id} AND NOT EXISTS (SELECT 1 FROM cic_trash_items ti WHERE ti.entity_type='user' AND ti.entity_id=u.id::text AND ti.status='trashed')`;
  if(!row?.email)throw new Error('Không tìm thấy tài khoản.');return String(row.email);
}

async function trashOneUser(id:number,actor:Awaited<ReturnType<typeof requirePermission>>){
  if(id===actor.legacyUserId)throw new Error('Không thể xóa tài khoản đang đăng nhập.');
  const sql=getPostgresClient();
  const [target]=await sql`SELECT id,auth_user_id,email,username,full_name,account_status FROM cic_users WHERE id=${id}`;
  if(!target)throw new Error('Không tìm thấy tài khoản.');
  const {admin,user}=await findAuthUser({authUserId:target.auth_user_id?String(target.auth_user_id):null,email:String(target.email??'')});
  const {error}=await admin.auth.admin.updateUserById(user.id,{ban_duration:'876000h',app_metadata:{...user.app_metadata,cms_profile:true,legacy_user_id:id}});
  if(error)throw new Error('Không thể khóa tài khoản xác thực trước khi chuyển vào Thùng rác.');
  try{return await trashUserRecord(id,actor);}
  catch(cause){await admin.auth.admin.updateUserById(user.id,{ban_duration:banDuration(String(target.account_status??'deactivated'))});throw cause;}
}

export async function deleteCmsUserAction(id:string){
  const actor=await requirePermission('users','delete');
  const result=await trashOneUser(idSchema.parse(id),actor);refresh();return{trashId:result.trashId};
}

export async function bulkDeleteCmsUsersAction(ids:string[]){
  const actor=await requirePermission('users','delete');const parsed=z.array(idSchema).min(1).max(100).parse(ids);const results=[];
  for(const id of [...new Set(parsed)]){try{const item=await trashOneUser(id,actor);results.push({id:String(id),ok:true,message:`Đã chuyển “${item.title}” vào Thùng rác.`});}catch(error){results.push({id:String(id),ok:false,message:error instanceof Error?error.message:'Không thể xóa tài khoản.'});}}
  refresh();return results;
}
