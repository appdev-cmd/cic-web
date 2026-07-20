export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  product_count: number;
}

export interface CategoryInput {
  name: string;
  description?: string | null;
}
