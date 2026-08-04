import { FilterState, PlaceholderValidation, TranslationItem, TranslationProgressStats } from './types';

/**
 * Extract tokens like {name}, {count}, {max_users} from source text
 */
export const extractPlaceholders = (text: string): string[] => {
  if (!text) return [];
  const regex = /\{[a-zA-Z0-9_]+\}/g;
  const matches = text.match(regex);
  return matches ? Array.from(new Set(matches)) : [];
};

/**
 * Validate whether all placeholders from source exist in target text
 */
export const validatePlaceholders = (
  sourceText: string,
  targetText: string,
  knownPlaceholders: string[] = []
): { validations: PlaceholderValidation[]; hasIssue: boolean } => {
  const sourceTokens = Array.from(
    new Set([...knownPlaceholders, ...extractPlaceholders(sourceText)])
  );

  if (sourceTokens.length === 0) {
    return { validations: [], hasIssue: false };
  }

  const validations = sourceTokens.map((token) => ({
    token,
    isPresent: targetText ? targetText.includes(token) : false,
  }));

  const hasIssue = validations.some((v) => !v.isPresent);
  return { validations, hasIssue };
};

/**
 * Calculate translation progress metrics and statistics
 */
export const computeProgressStats = (items: TranslationItem[]): TranslationProgressStats => {
  const totalItems = items.length;

  const frontendItems = items.filter((i) => i.scope === 'frontend');
  const backendItems = items.filter((i) => i.scope === 'backend');
  const contentItems = items.filter((i) => i.scope === 'content_module');

  const frontendCount = frontendItems.length;
  const backendCount = backendItems.length;
  const contentCount = contentItems.length;

  // Highlight missing EN backend strings
  const missingEnCount = backendItems.filter(
    (i) => i.status === 'missing' || (!i.target_text && i.target_locale === 'en')
  ).length;

  const outdatedCount = items.filter((i) => i.status === 'outdated').length;
  const reviewPendingCount = items.filter((i) => i.status === 'review').length;
  const completedCount = items.filter((i) => i.status === 'complete').length;
  const inProgressCount = items.filter((i) => i.status === 'in_progress').length;

  const calcPct = (done: number, total: number) => (total > 0 ? Math.round((done / total) * 100) : 0);

  const overallCompletionPercentage = calcPct(completedCount, totalItems);
  const frontendCompletionPercentage = calcPct(
    frontendItems.filter((i) => i.status === 'complete').length,
    frontendCount
  );
  const backendCompletionPercentage = calcPct(
    backendItems.filter((i) => i.status === 'complete').length,
    backendCount
  );
  const contentCompletionPercentage = calcPct(
    contentItems.filter((i) => i.status === 'complete').length,
    contentCount
  );

  return {
    totalItems,
    frontendCount,
    backendCount,
    contentCount,
    missingEnCount,
    outdatedCount,
    reviewPendingCount,
    completedCount,
    inProgressCount,
    overallCompletionPercentage,
    frontendCompletionPercentage,
    backendCompletionPercentage,
    contentCompletionPercentage,
  };
};

/**
 * Filter translation items based on search query, type, scope, status, assignee, etc.
 */
export const filterTranslationItems = (
  items: TranslationItem[],
  filter: FilterState,
  currentUserId: string
): TranslationItem[] => {
  return items.filter((item) => {
    // Search Query (matches key, module_name, source_text, target_text, context_description)
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      const matchKey = item.key.toLowerCase().includes(q);
      const matchModule = item.module_name.toLowerCase().includes(q);
      const matchSource = item.source_text.toLowerCase().includes(q);
      const matchTarget = item.target_text.toLowerCase().includes(q);
      const matchContext = item.context_description?.toLowerCase().includes(q) || false;

      if (!matchKey && !matchModule && !matchSource && !matchTarget && !matchContext) {
        return false;
      }
    }

    // Item Types
    if (filter.itemTypes.length > 0 && !filter.itemTypes.includes(item.item_type)) {
      return false;
    }

    // Scopes (frontend, backend, content_module)
    if (filter.scopes.length > 0 && !filter.scopes.includes(item.scope)) {
      return false;
    }

    // Statuses
    if (filter.statuses.length > 0 && !filter.statuses.includes(item.status)) {
      return false;
    }

    // Modules
    if (filter.modules.length > 0 && !filter.modules.includes(item.module_name)) {
      return false;
    }

    // Assignee
    if (filter.assigneeId !== 'all') {
      if (filter.assigneeId === 'me' && item.assignee_id !== currentUserId) {
        return false;
      }
      if (filter.assigneeId === 'unassigned' && item.assignee_id) {
        return false;
      }
      if (
        filter.assigneeId !== 'me' &&
        filter.assigneeId !== 'unassigned' &&
        item.assignee_id !== filter.assigneeId
      ) {
        return false;
      }
    }

    // Reviewer
    if (filter.reviewerId !== 'all') {
      if (item.reviewer_id !== filter.reviewerId) {
        return false;
      }
    }

    // Target Locale
    if (filter.targetLocale !== 'all' && item.target_locale !== filter.targetLocale) {
      return false;
    }

    // Placeholder Issue filter
    if (filter.hasPlaceholderIssue) {
      const { hasIssue } = validatePlaceholders(item.source_text, item.target_text, item.placeholders);
      if (!hasIssue) return false;
    }

    return true;
  });
};
