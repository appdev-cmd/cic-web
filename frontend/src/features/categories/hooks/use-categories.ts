import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../api/categories-api";

export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: categoriesApi.list });
}

export function useCategoryMutations() {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["categories"] });
  return {
    create: useMutation({ mutationFn: categoriesApi.create, onSuccess: refresh }),
    update: useMutation({ mutationFn: ({ id, ...payload }: { id: string; name: string; description?: string | null }) => categoriesApi.update(id, payload), onSuccess: refresh }),
    remove: useMutation({ mutationFn: categoriesApi.remove, onSuccess: refresh }),
  };
}
