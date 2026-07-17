import { api } from "@/lib/api";
import type { Receita, ReceitaInput } from "@/types";

export const recipeService = {
  list: () => api.get<Receita[]>("/api/Receita").then((r) => r.data),
  get: (id: number | string) => api.get<Receita>(`/api/Receita/${id}`).then((r) => r.data),
  create: (payload: ReceitaInput) =>
    api.post<Receita>("/api/Receita", payload).then((r) => r.data),
  update: (id: number, payload: ReceitaInput) =>
    api.put<Receita>(`/api/Receita/${id}`, payload).then((r) => r.data),
  remove: (id: number) => api.delete(`/api/Receita/${id}`).then((r) => r.data),
};
