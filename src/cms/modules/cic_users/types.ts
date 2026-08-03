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
  published: boolean;
  ordering: number;
  agencies: string[];
  products_categories: string[];
  news_categories: string[];
  // System managed fields
  status_online: boolean;
  created_time: string;
  updated_time?: string;
  last_visit_time?: string;
  nums_visit?: number;
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
