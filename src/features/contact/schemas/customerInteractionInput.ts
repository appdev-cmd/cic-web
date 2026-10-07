import { z } from 'zod';
export const customerInteractionInputSchema = z.object({
  formId: z.string().min(1).max(255),
  formName: z.string().min(1).max(255),
  values: z.record(z.string(), z.unknown()),
  source: z.object({
    pageType: z.string().max(255),
    pageId: z.string().max(255),
    pageUrl: z.string().max(2000),
    pageTitle: z.string().max(255),
    placementKey: z.string().max(255).optional(),
    ctaId: z.string().max(255).optional(),
    ctaName: z.string().max(255).optional(),
    utmSource: z.string().max(255).optional(),
    utmMedium: z.string().max(255).optional(),
    utmCampaign: z.string().max(255).optional(),
    utmTerm: z.string().max(255).optional(),
    utmContent: z.string().max(255).optional(),
    referrer: z.string().max(2000).optional(),
  }),
});
