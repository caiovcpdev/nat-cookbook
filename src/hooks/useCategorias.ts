import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/categoryService";
import { QUERY_KEYS } from "@/constants";
import type { CategoriaInput } from "@/types";

export function useCategorias() {
  return useQuery({
    queryKey: QUERY_KEYS.categorias,
    queryFn: categoryService.list,
    staleTime: 5 * 60_000,
  });
}

export function useCreateCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CategoriaInput) => categoryService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.categorias }),
  });
}

export function useUpdateCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: CategoriaInput }) =>
      categoryService.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.categorias }),
  });
}

export function useDeleteCategoria() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoryService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.categorias }),
  });
}
