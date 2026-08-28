'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requirePermission } from '@/server/auth/guards';
import { createSupabaseAdminClient } from '@/server/supabase/admin';
import { accountStatusSchema, userInputSchema } from '../schemas/userInput';
import { createUserRecord, updateUserRecord, updateUserStatuses } from './repository';

const idSchema = z.coerce.number().int().positive();
const refresh = () => revalidatePath('/cms', 'layout');
async function findAuthUserByEmail(email: string) {
  const admin = createSupabaseAdminClient();
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw new Error('Không thể đồng bộ tài khoản xác thực.');
    const found = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (found) return { admin, user: found };
    if (data.users.length < 100) break;
  }
  return { admin, user: null };
}
export async function createCmsUserAction(payload: unknown) {
  const actor = await requirePermission('users', 'create');
  const input = userInputSchema.extend({ password: z.string().min(8).max(128) }).parse(payload);
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.createUser({ email: input.email, password: input.password, email_confirm: true, user_metadata: { username: input.username, full_name: `${input.lname} ${input.fname}`.trim() } });
  if (error || !data.user) throw new Error('Không thể tạo tài khoản xác thực.');
  try {
    const id = await createUserRecord(input, actor.legacyUserId);
    refresh();
    return { id: String(id) };
  } catch (error) {
    await admin.auth.admin.deleteUser(data.user.id);
    throw error;
  }
}
export async function updateCmsUserAction(id: string, payload: unknown) {
  const actor = await requirePermission('users', 'edit');
  const input = userInputSchema.parse(payload);
  const numericId = idSchema.parse(id);
  const result = await updateUserRecord(numericId, input, actor.legacyUserId);
  const auth = await findAuthUserByEmail(result.previousEmail);
  if (auth.user) {
    const { error } = await auth.admin.auth.admin.updateUserById(auth.user.id, { email: input.email, password: input.password, user_metadata: { username: input.username, full_name: `${input.lname} ${input.fname}`.trim() }, ban_duration: input.status === 'active' ? 'none' : '876000h' });
    if (error) throw new Error('Hồ sơ đã lưu nhưng không thể đồng bộ tài khoản xác thực.');
  }
  refresh();
  return { id };
}
export async function updateCmsUserStatusAction(id: string, status: unknown, reason: unknown) {
  const actor = await requirePermission('users', 'edit');
  const safeReason = z.string().trim().min(1).max(1000).parse(reason);
  await updateUserStatuses([idSchema.parse(id)], accountStatusSchema.parse(status), safeReason, actor.legacyUserId);
  refresh();
}
export async function bulkUpdateCmsUserStatusAction(ids: string[], status: unknown) {
  const actor = await requirePermission('users', 'edit');
  const parsedIds = z.array(idSchema).min(1).max(100).parse(ids);
  const parsedStatus = accountStatusSchema.parse(status);
  await updateUserStatuses(parsedIds, parsedStatus, `Cập nhật hàng loạt sang ${parsedStatus}`, actor.legacyUserId);
  refresh();
}
export async function sendCmsPasswordResetAction(email: string) {
  await requirePermission('users', 'edit');
  const safeEmail = z.string().email().max(50).parse(email);
  const admin = createSupabaseAdminClient();
  const { error } = await admin.auth.resetPasswordForEmail(safeEmail);
  if (error) throw new Error('Không thể gửi email khôi phục mật khẩu.');
}
