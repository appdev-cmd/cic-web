export interface BannerCategory {
  id: string;
  name: string;
  summary: string;
  width: number;
  height: number;
  price: number;
  days: number;
  quantity: number;
  link_post: string;
  published: boolean;
  ordering: number;
  created_time?: string;
  updated_time?: string;
}
