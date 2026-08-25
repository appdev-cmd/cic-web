export const SYSTEM_FORM_IDS = {
  homeConsultation: 'form_home_consultation',
  contactRequest: 'form_contact_request',
} as const;

export const SYSTEM_CTA_IDS = {
  exploreProducts: 'cta_explore_products',
  aboutCic: 'cta_about_cic',
  contact: 'cta_contact',
} as const;

export type CustomerInteractionOrigin = 'system' | 'custom';
export type CustomerInteractionEmbed = 'cta' | 'form';
export type CustomerInteractionPlacement =
  | 'fixed_section'
  | 'rich_text'
  | 'cta_action';

export interface CustomerInteractionGovernance {
  origin: CustomerInteractionOrigin;
  allowedPlacements: CustomerInteractionPlacement[];
  fixedPlacementKeys?: string[];
}

export interface CustomerInteractionSubmissionSource {
  pageType: string;
  pageId: string;
  pageUrl: string;
  pageTitle: string;
  placementKey?: string;
  ctaId?: string;
  ctaName?: string;
}

export interface CustomerInteractionSubmissionInput {
  formId: string;
  formName: string;
  values: Record<string, unknown>;
  source: CustomerInteractionSubmissionSource;
}

export interface CustomerInteractionSubmissionResult {
  requestId: string;
  submittedAt: string;
}

export interface CustomerInteractionSubmissionGateway {
  submit(input: CustomerInteractionSubmissionInput): Promise<CustomerInteractionSubmissionResult>;
}

