'use server';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/server/auth/guards';
import type { TrashMutationItemResult } from '../types';
import { trashIdsSchema, trashPurgeInputSchema, trashRestoreInputSchema } from '../schemas/trashInput';
import { getCmsTrashDetail, getCmsTrashPage } from './queries';
import { purgeTrashRecord, restoreTrashRecord } from './repository';
import type { TrashRevalidationTarget } from './registry-types';

const message = (error: unknown) => error instanceof Error ? error.message : 'Không thể hoàn tất thao tác Thùng rác.';
const trashPageTarget: TrashRevalidationTarget = { path: '/cms/trash' };

function revalidateTargets(targets: readonly TrashRevalidationTarget[]) {
  const unique = new Map<string, TrashRevalidationTarget>();
  for (const target of [trashPageTarget, ...targets]) unique.set(`${target.path}:${target.type ?? ''}`, target);
  for (const target of unique.values()) {
    if (target.type) revalidatePath(target.path, target.type);
    else revalidatePath(target.path);
  }
}

export async function getTrashPageAction(raw: unknown) { return getCmsTrashPage(raw); }
export async function getTrashDetailAction(rawId: unknown) { return getCmsTrashDetail(rawId); }

export async function restoreTrashItemAction(raw: unknown): Promise<TrashMutationItemResult> {
  const actor = await requirePermission('trash', 'restore'); const input = trashRestoreInputSchema.parse(raw);
  try {
    const result = await restoreTrashRecord(input.id, input.mode, actor); revalidateTargets(result.revalidationTargets);
    return { id: input.id, ok: true, message: `Đã phục hồi “${result.title}” về bản nháp.` };
  } catch (error) { return { id: input.id, ok: false, message: message(error) }; }
}

export async function purgeTrashItemAction(raw: unknown): Promise<TrashMutationItemResult> {
  const actor = await requirePermission('trash', 'purge'); const input = trashPurgeInputSchema.parse(raw);
  try {
    const result = await purgeTrashRecord(input.id, input.reason, actor); revalidateTargets(result.revalidationTargets);
    return { id: input.id, ok: true, message: `Đã xóa vĩnh viễn “${result.title}”.` };
  } catch (error) { return { id: input.id, ok: false, message: message(error) }; }
}

export async function bulkRestoreTrashItemsAction(rawIds: unknown): Promise<TrashMutationItemResult[]> {
  const actor = await requirePermission('trash', 'restore'); const ids = trashIdsSchema.parse(rawIds); const results: TrashMutationItemResult[] = [];
  const targets: TrashRevalidationTarget[] = [];
  for (const id of ids) {
    try { const restored = await restoreTrashRecord(id, 'as_draft', actor); targets.push(...restored.revalidationTargets); results.push({ id, ok: true, message: `Đã phục hồi “${restored.title}”.` }); }
    catch (error) { results.push({ id, ok: false, message: message(error) }); }
  }
  revalidateTargets(targets); return results;
}

export async function bulkPurgeTrashItemsAction(raw: unknown): Promise<TrashMutationItemResult[]> {
  const actor = await requirePermission('trash', 'purge');
  const input = typeof raw === 'object' && raw ? raw as { ids?: unknown; reason?: unknown } : {};
  const ids = trashIdsSchema.parse(input.ids); const reason = trashPurgeInputSchema.shape.reason.parse(input.reason); const results: TrashMutationItemResult[] = [];
  const targets: TrashRevalidationTarget[] = [];
  for (const id of ids) {
    try { const purged = await purgeTrashRecord(id, reason, actor); targets.push(...purged.revalidationTargets); results.push({ id, ok: true, message: `Đã xóa vĩnh viễn “${purged.title}”.` }); }
    catch (error) { results.push({ id, ok: false, message: message(error) }); }
  }
  revalidateTargets(targets); return results;
}
