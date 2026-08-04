export type UserAccountStatus = 'active' | 'suspended' | 'deactivated' | 'pending_invite';

export interface UserSecurityLog {
  id: string;
  timestamp: string;
  action: string;
  ip_address: string;
  user_agent?: string;
  status: 'success' | 'warning' | 'failed';
  details?: string;
}

export interface UserStatusHistory {
  id: string;
  timestamp: string;
  previous_status: UserAccountStatus;
  new_status: UserAccountStatus;
  changed_by: string;
  reason: string;
}

export interface CicUser {
  id: string;
  username: string;
  password?: string;
  email: string;
  fname: string;
  lname: string;
  full_name: string;
  phone: string;
  country: string;
  address: string;
  summary: string;
  avatar: string;
  published: boolean; // Map true -> active, false -> suspended/deactivated
  status: UserAccountStatus;
  role_id: string;
  role_name: string;
  ordering: number;
  agencies: string[];
  products_categories: string[];
  news_categories: string[];
  // Security & Audit
  two_factor_enabled?: boolean;
  password_last_changed?: string;
  failed_login_attempts?: number;
  security_logs?: UserSecurityLog[];
  status_history?: UserStatusHistory[];
  // System managed fields
  status_online: boolean;
  created_time: string;
  updated_time?: string;
  last_visit_time?: string;
  nums_visit?: number;
}

export interface RoleOption {
  id: string;
  name: string;
  description: string;
  permissions_count: number;
  badge_color: string;
}

export interface AgencyOption {
  id: string;
  name: string;
  code: string;
}

export interface CategoryOption {
  id: string;
  name: string;
  code?: string;
}

