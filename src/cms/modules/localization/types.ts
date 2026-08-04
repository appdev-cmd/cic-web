export type ItemType = 'ui_string' | 'content';
export type ScopeType = 'frontend' | 'backend' | 'content_module';
export type TranslationStatus = 'missing' | 'in_progress' | 'review' | 'complete' | 'outdated';
export type LocalePair = 'vi_to_en' | 'en_to_vi' | 'vi_to_ja';

export type MainTabType = 
  | 'overview' 
  | 'all' 
  | 'frontend' 
  | 'backend' 
  | 'content' 
  | 'my_queue' 
  | 'review_queue' 
  | 'missing' 
  | 'outdated';

export type SavedFilterView = 
  | 'all' 
  | 'my_queue' 
  | 'en_missing' 
  | 'outdated' 
  | 'review_pending' 
  | 'source_changed_recent';

export type UserRole = 'translator' | 'reviewer' | 'editor' | 'manager' | 'admin';

export interface StaffUser {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  email: string;
}

export interface TranslationComment {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
  type?: 'general' | 'return_reason' | 'suggestion';
}

export interface TranslationHistoryEntry {
  id: string;
  timestamp: string;
  actor_name: string;
  event_type: 'created' | 'draft_saved' | 'submitted_review' | 'completed' | 'returned' | 'source_updated' | 'reassigned';
  description: string;
  old_value?: string;
  new_value?: string;
}

export interface PlaceholderValidation {
  token: string;
  isPresent: boolean;
}

export interface TranslationItem {
  id: string;
  key: string; // e.g., "nav.products.title" or "api.err.unauthorized" or "content_news_101"
  item_type: ItemType;
  scope: ScopeType;
  module_name: string; // e.g. "Header & Navigation", "Auth API", "Tin tức", "Sản phẩm"
  source_text: string; // VI source
  previous_source_text?: string; // used when source text changed and item became outdated
  target_text: string; // EN target text
  previous_target_text?: string;
  source_locale: 'vi';
  target_locale: 'en' | 'ja';
  status: TranslationStatus;
  assignee_id?: string;
  assignee_name?: string;
  assignee_avatar?: string;
  reviewer_id?: string;
  reviewer_name?: string;
  reviewer_avatar?: string;
  due_date?: string;
  context_description?: string;
  screen_usage?: string;
  screenshot_url?: string;
  placeholders?: string[]; // e.g., ["{count}", "{name}"]
  is_shared_field?: boolean; // For content items, indicates shared field notice
  shared_field_info?: string;
  updated_at: string;
  source_updated_at: string;
  comments: TranslationComment[];
  history: TranslationHistoryEntry[];
}

export interface FilterState {
  searchQuery: string;
  itemTypes: ItemType[];
  scopes: ScopeType[];
  statuses: TranslationStatus[];
  modules: string[];
  assigneeId: string;
  reviewerId: string;
  targetLocale: string;
  hasPlaceholderIssue: boolean;
  dateRange: string;
}

export interface TranslationProgressStats {
  totalItems: number;
  frontendCount: number;
  backendCount: number;
  contentCount: number;
  missingEnCount: number; // highlights the 44 missing EN backend strings
  outdatedCount: number;
  reviewPendingCount: number;
  completedCount: number;
  inProgressCount: number;
  overallCompletionPercentage: number;
  frontendCompletionPercentage: number;
  backendCompletionPercentage: number;
  contentCompletionPercentage: number;
}
