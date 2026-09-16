import { z } from 'zod';

/**
 * Persistence contract for Reference Source Mode.
 *
 * NOTE: The reference source mode is a SECTION CONFIGURATION property,
 * persisted strictly inside `cic_content_page_sections.config` as:
 *
 * ```json
 * {
 *   "referenceSource": {
 *     "mode": "manual" | "auto_featured",
 *     "limit": 3
 *   }
 * }
 * ```
 *
 * - When mode is 'manual':
 *   The entity IDs are persisted as rows in `cic_content_page_section_references`.
 *   Section config NEVER snapshots full entity objects.
 *
 * - When mode is 'auto_featured':
 *   NO rows are persisted in `cic_content_page_section_references`.
 *   The section config only persists `{ mode: 'auto_featured', limit: N }`.
 *   The runtime resolver calculates and fetches featured entities dynamically
 *   using code-defined domain rules.
 */

export const REFERENCE_SOURCE_MODES = ['manual', 'auto_featured'] as const;
export type ReferenceSourceMode = (typeof REFERENCE_SOURCE_MODES)[number];

export const referenceSourceConfigSchema = z.object({
  mode: z.enum(REFERENCE_SOURCE_MODES),
  limit: z.number().int().positive().max(50).optional(),
});

export type SectionReferenceSourceConfig = z.infer<typeof referenceSourceConfigSchema>;

export type PageBuilderEntityType =
  | 'product'
  | 'news'
  | 'service'
  | 'project'
  | 'partner'
  | 'event';

export interface ReferenceSectionCapability {
  sectionKey: string;
  allowedEntityTypes: readonly PageBuilderEntityType[];
  allowedModes: readonly ReferenceSourceMode[];
  defaultMode: ReferenceSourceMode;
  maxItems: number | Partial<Record<PageBuilderEntityType, number>>;
  orderingSemantics: 'manual_position' | 'priority_then_created_at';
  description: string;
}

/**
 * Registry authority for reference-capable sections in Page Builder Core.
 * Server-side validation MUST enforce these contracts.
 */
export const SECTION_REFERENCE_REGISTRY: Record<string, ReferenceSectionCapability> = {
  'home.projects': {
    sectionKey: 'home.projects',
    allowedEntityTypes: ['project'],
    allowedModes: ['manual', 'auto_featured'],
    defaultMode: 'auto_featured',
    maxItems: 3,
    orderingSemantics: 'manual_position',
    description: 'Dự án tiêu biểu: tự động lấy tối đa 3 dự án nổi bật hoặc chọn thủ công tối đa 3 dự án.',
  },
  'home.events': {
    sectionKey: 'home.events',
    allowedEntityTypes: ['event'],
    allowedModes: ['manual', 'auto_featured'],
    defaultMode: 'auto_featured',
    maxItems: 4,
    orderingSemantics: 'manual_position',
    description: 'Sự kiện nổi bật: tự động lấy tối đa 4 sự kiện nổi bật (1 chính + 3 phụ) hoặc chọn thủ công tối đa 4 sự kiện.',
  },
  'home.news': {
    sectionKey: 'home.news',
    allowedEntityTypes: ['news'],
    allowedModes: ['manual', 'auto_featured'],
    defaultMode: 'auto_featured',
    maxItems: 4,
    orderingSemantics: 'manual_position',
    description: 'Tin tức & Góc nhìn: tự động lấy tối đa 4 tin tức nổi bật hoặc chọn thủ công tối đa 4 tin.',
  },
  'home.partners': {
    sectionKey: 'home.partners',
    allowedEntityTypes: ['partner'],
    allowedModes: ['manual'],
    defaultMode: 'manual',
    maxItems: 12,
    orderingSemantics: 'manual_position',
    description: 'Đối tác chiến lược: danh sách đối tác chọn thủ công, hiển thị marquee.',
  },
  'about.offerings': {
    sectionKey: 'about.offerings',
    allowedEntityTypes: ['product', 'service'],
    allowedModes: ['manual'],
    defaultMode: 'manual',
    maxItems: { product: 2, service: 4 },
    orderingSemantics: 'manual_position',
    description: 'Sản phẩm và dịch vụ cung cấp: chọn thủ công tối đa 2 sản phẩm và 4 dịch vụ.',
  },
  'about.software_partners': {
    sectionKey: 'about.software_partners',
    allowedEntityTypes: ['partner'],
    allowedModes: ['manual'],
    defaultMode: 'manual',
    maxItems: 12,
    orderingSemantics: 'manual_position',
    description: 'Đối tác phần mềm: danh sách đối tác phần mềm chọn thủ công.',
  },
  'about.hardware_partners': {
    sectionKey: 'about.hardware_partners',
    allowedEntityTypes: ['partner'],
    allowedModes: ['manual'],
    defaultMode: 'manual',
    maxItems: 12,
    orderingSemantics: 'manual_position',
    description: 'Đối tác thiết bị: danh sách đối tác thiết bị chọn thủ công.',
  },
};

/**
 * Validates manual reference input against section capability.
 */
export function validateManualReferences(
  sectionKey: string,
  references: readonly { entityType: string; entityId: string | number }[]
): { valid: boolean; error?: string } {
  const capability = SECTION_REFERENCE_REGISTRY[sectionKey];
  if (!capability) {
    return { valid: false, error: `Section ${sectionKey} does not accept references.` };
  }
  if (!capability.allowedModes.includes('manual')) {
    return { valid: false, error: `Section ${sectionKey} does not allow manual reference mode.` };
  }

  // Check unique IDs
  const seen = new Set<string>();
  for (const ref of references) {
    const key = `${ref.entityType}:${ref.entityId}`;
    if (seen.has(key)) {
      return { valid: false, error: `Duplicate reference entity: ${key}` };
    }
    seen.add(key);

    if (!capability.allowedEntityTypes.includes(ref.entityType as PageBuilderEntityType)) {
      return {
        valid: false,
        error: `Entity type '${ref.entityType}' is not permitted for section '${sectionKey}'.`,
      };
    }
  }

  if (typeof capability.maxItems === 'number') {
    if (references.length > capability.maxItems) {
      return {
        valid: false,
        error: `Exceeded maximum of ${capability.maxItems} references for section '${sectionKey}'.`,
      };
    }
  } else {
    // Count per entity type
    const counts: Record<string, number> = {};
    for (const ref of references) {
      counts[ref.entityType] = (counts[ref.entityType] ?? 0) + 1;
    }
    for (const [type, max] of Object.entries(capability.maxItems)) {
      if ((counts[type] ?? 0) > (max ?? 0)) {
        return {
          valid: false,
          error: `Exceeded maximum of ${max} ${type} references for section '${sectionKey}'.`,
        };
      }
    }
  }

  return { valid: true };
}
