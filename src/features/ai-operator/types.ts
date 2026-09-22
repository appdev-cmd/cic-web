/**
 * Core type contracts for the AI Content Operator (CMS CIC)
 */

export type FieldOrigin = 'verified' | 'generated' | 'suggested' | 'missing';

export type ProductFormViewMode = 'needs_attention' | 'ai_suggestions' | 'all';

export interface FieldChangeItem {
  field: string;
  label: string;
  group: 'content' | 'classification' | 'relations' | 'seo' | 'normalization';
  origin: FieldOrigin;
  oldValue: unknown;
  newValue: unknown;
  reason?: string;
}

export interface NeedsAttentionItem {
  field: string;
  label: string;
  reason: string;
  required: boolean;
  suggestedValue?: unknown;
}

export interface AiProductDraftResult {
  productData: Record<string, unknown>;
  fieldOrigins: Record<string, FieldOrigin>;
  changes: FieldChangeItem[];
  needsAttention: NeedsAttentionItem[];
  suggestedCount: number;
  completedCount: number;
  executionLogs: Array<{
    step: string;
    status: 'done' | 'running' | 'skipped' | 'warn';
    detail: string;
  }>;
}

export type ProductAiActionType =
  | 'complete_missing'
  | 'improve_description'
  | 'optimize_seo'
  | 'suggest_taxonomy'
  | 'suggest_relations'
  | 'preflight_audit'
  | 'sync_translation';

export interface LlmGenerateOptions {
  systemPrompt: string;
  userPrompt: string;
  jsonSchema?: object;
  temperature?: number;
}

export interface LlmProvider {
  name: string;
  generateStructured<T>(options: LlmGenerateOptions): Promise<T>;
}
