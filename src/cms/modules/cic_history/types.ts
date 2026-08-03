export type HistoryType =
  | 'Create'
  | 'Update'
  | 'Delete'
  | 'Success'
  | 'Warning'
  | 'Error'
  | 'Expired'
  | 'Login';

export interface CicHistoryLog {
  id: string;
  created_time: string;
  username: string;
  user_fullname?: string;
  type: HistoryType;
  service_name: string;
  description: string;
  ip_address: string;
  user_agent?: string;
  published?: boolean;
  request_data?: Record<string, any>;
  response_data?: Record<string, any>;
}

export interface HistoryFilterState {
  usernameSearch: string;
  typeFilter: string;
  serviceFilter: string;
  startDate: string;
  endDate: string;
  publishedFilter: string;
}
