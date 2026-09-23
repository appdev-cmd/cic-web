import type { FormDestinationEntity } from '@/features/forms/types';

export interface FormSubmissionFieldContext {
  fieldKey: string;
  label: string;
  fieldType: string;
  roleType?: string;
  value: any;
}

export interface FormSubmissionContext {
  submissionId: string;
  formId: number;
  formCode: string;
  formTitle: string;
  workspace: string;
  submittedAt: Date;
  sourcePath?: string;
  sourceType?: string;
  ctaId?: number | null;
  placementKey?: string | null;
  clientIp?: string;
  fields: Record<string, FormSubmissionFieldContext>;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  successMessage?: string;
  redirectUrl?: string | null;
}

export interface DeliveryResult {
  destinationId: string;
  destinationType: string;
  destinationName?: string;
  status: 'success' | 'failed';
  lastError?: string | null;
  responseMetadata?: Record<string, any> | null;
}

export interface IDestinationAdapter {
  readonly type: string;
  deliver(destination: FormDestinationEntity, context: FormSubmissionContext): Promise<DeliveryResult>;
}
