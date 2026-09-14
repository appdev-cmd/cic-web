// Customer Request Module Types
import { RequestStatus, PriorityLevel } from '../shared/constants/statusTypes';

// Re-export domain models as single source of truth
export type {
  SourceConfig,
  SubmissionValue,
  RequestNote,
  RequestLog,
  CustomerRequest,
  RequestListTabType,
} from '@/features/customer-requests/types';

export interface RequestFilterState {
  searchQuery: string;
  status?: RequestStatus;
  formId?: string;
  ctaId?: string;
  pageId?: string;
  assignedUserId?: string;
  tab: import('@/features/customer-requests/types').RequestListTabType;
  dateFrom?: string;
  dateTo?: string;
}
