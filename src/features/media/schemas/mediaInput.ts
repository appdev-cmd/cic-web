import { z } from 'zod';
import { MEDIA_LICENSE_TYPES, MEDIA_LOCALES, MEDIA_MAX_FILE_BYTES, MEDIA_TYPES } from '../constants';

const id = z.coerce.number().int().positive();
const nullableText = (max: number) => z.string().trim().max(max).nullable().optional();

export const mediaUploadRegistrationSchema = z.object({
  storagePath: z.string().min(3).max(1000).refine((value) => /^(vi|en|global)\//.test(value)),
  filename: z.string().trim().min(1).max(255), mimeType: z.string().trim().min(3).max(150),
  fileSizeBytes: z.number().int().nonnegative().max(MEDIA_MAX_FILE_BYTES), mediaType: z.enum(MEDIA_TYPES),
  locale: z.enum(MEDIA_LOCALES), title: z.string().trim().min(1).max(255), altText: z.string().trim().max(1000).default(''),
  width: z.number().int().positive().nullable().optional(), height: z.number().int().positive().nullable().optional(),
  durationSeconds: z.number().nonnegative().nullable().optional(), folderId: id.nullable().optional(),
});
export const mediaMetadataPatchSchema = z.object({
  locale: z.enum(MEDIA_LOCALES), title: z.string().trim().min(1).max(255), description: nullableText(5000),
  altText: z.string().trim().max(1000), caption: nullableText(2000), creditAuthor: nullableText(255),
  licenseType: z.enum(MEDIA_LICENSE_TYPES).nullable().optional(), licenseExpiry: z.iso.date().nullable().optional(),
  tags: z.array(z.string().trim().min(1).max(80)).max(50), folderId: id.nullable(),
});
export const mediaFolderInputSchema = z.object({ workspace: z.enum(MEDIA_LOCALES), name: z.string().trim().min(1).max(255), alias: z.string().trim().min(1).max(150).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) });
export const mediaAlbumInputSchema = z.object({ workspace: z.enum(MEDIA_LOCALES), title: z.string().trim().min(1).max(255), alias: z.string().trim().min(1).max(150).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().trim().max(5000).nullable(), workflowStatus: z.enum(['draft','published','archived']), coverAssetId: id.nullable(), assetIds: z.array(id).max(500) });
export const mediaReplaceRegistrationSchema = mediaUploadRegistrationSchema.pick({ storagePath:true,filename:true,mimeType:true,fileSizeBytes:true,width:true,height:true,durationSeconds:true }).extend({ note:z.string().trim().min(1).max(2000) });
export const mediaIdSchema = id;
export type MediaUploadRegistration = z.infer<typeof mediaUploadRegistrationSchema>;
export type MediaMetadataPatch = z.infer<typeof mediaMetadataPatchSchema>;
export type MediaAlbumInput = z.infer<typeof mediaAlbumInputSchema>;
