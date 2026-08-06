// Shared types for Customer Interaction System

export interface BaseEntity {
  id: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PaginationParams {
  page: number;
  perPage: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface UsageLocation {
  pageId: string;
  pageTitle: string;
  pagePath: string;
  placementKey: string;
}

export interface AnalyticsData {
  impressions: number;
  clicks: number;
  ctr: number;
  trend?: 'up' | 'down' | 'flat';
}
