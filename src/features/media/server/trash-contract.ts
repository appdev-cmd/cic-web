import 'server-only';
import { z } from 'zod';

export const MEDIA_TRASH_ENTITY_TYPE = 'media_asset' as const;
export const MEDIA_TRASH_MODULE = 'media' as const;
export const MEDIA_TRASH_SNAPSHOT_VERSION = 1 as const;

const translationSchema = z.object({
  locale: z.enum(['vi', 'en']),
  title: z.string(),
  description: z.string().nullable(),
  altText: z.string(),
  caption: z.string().nullable(),
});

const folderRelationSchema = z.object({
  folderId: z.string().regex(/^\d+$/),
  ordering: z.number().int().nonnegative(),
});

const albumRelationSchema = z.object({
  albumId: z.string().regex(/^\d+$/),
  position: z.number().int().positive(),
});

/**
 * Trusted server snapshot required before a Media adapter can be registered.
 * Binary deletion is deliberately excluded: purge must first prove that no
 * live reference/version/variant needs the object and then remove Storage data.
 */
export const mediaTrashSnapshotSchema = z.object({
  version: z.literal(MEDIA_TRASH_SNAPSHOT_VERSION),
  assetId: z.string().regex(/^\d+$/),
  filename: z.string().min(1),
  mediaType: z.enum(['image', 'video', 'document']),
  storagePath: z.string().min(1),
  thumbnailPath: z.string().nullable(),
  workflowStatus: z.enum(['processing', 'ready', 'restricted', 'archived']),
  translations: z.array(translationSchema),
  folders: z.array(folderRelationSchema),
  albums: z.array(albumRelationSchema),
});

export type MediaTrashSnapshot = z.infer<typeof mediaTrashSnapshotSchema>;
