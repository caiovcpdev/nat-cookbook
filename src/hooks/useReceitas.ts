import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recipeService } from "@/services/recipeService";
import { QUERY_KEYS } from "@/constants";
import type { ReceitaInput } from "@/types";

export function useReceitas() {
  return useQuery({
    queryKey: QUERY_KEYS.receitas,
    queryFn: recipeService.list,
    staleTime: 30_000,
  });
}

export function useReceita(id: number | string | undefined) {
  return useQuery({
    queryKey: id ? QUERY_KEYS.receita(id) : ["receitas", "none"],
    queryFn: () => recipeService.get(id!),
    enabled: !!id,
  });
}

export function useCreateReceita() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ReceitaInput) => recipeService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.receitas }),
  });
}

export function useUpdateReceita(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ReceitaInput) => recipeService.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.receitas });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.receita(id) });
    },
  });
}

export function useDeleteReceita() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => recipeService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.receitas }),
  });
}
