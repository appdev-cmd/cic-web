import { apiRequest } from "@/shared/api/client";
import type { Category, CategoryInput } from "../types";

export const categoriesApi = {
  list: () => apiRequest<Category[]>("/categories/"),
  create: (payload: CategoryInput) => apiRequest<Category>("/categories/", { method: "POST", body: JSON.stringify(payload) }),
  update: (id: string, payload: CategoryInput) => apiRequest<Category>(`/categories/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  remove: (id: string) => apiRequest<void>(`/categories/${id}`, { method: "DELETE" }),
};
