import { z } from 'zod';
import { TRASH_RESTORE_MODES } from '../types';

export const trashIdSchema = z.string().uuid();
export const trashIdsSchema = z.array(trashIdSchema).min(1).max(100).transform((ids) => [...new Set(ids)]);
export const trashRestoreInputSchema = z.object({
  id: trashIdSchema,
  mode: z.enum(TRASH_RESTORE_MODES).default('as_draft'),
});
export const trashPurgeInputSchema = z.object({
  id: trashIdSchema,
  reason: z.string().trim().min(5, 'Vui lòng nhập lý do xóa vĩnh viễn có ít nhất 5 ký tự.').max(1000),
});

