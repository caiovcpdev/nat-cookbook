import { api } from "@/lib/api";
import type { Categoria, CategoriaInput } from "@/types";

export const categoryService = {
  list: () => api.get<Categoria[]>("/api/Categoria").then((r) => r.data),
  get: (id: number) => api.get<Categoria>(`/api/Categoria/${id}`).then((r) => r.data),
  create: (payload: CategoriaInput) =>
    api.post<Categoria>("/api/Categoria", payload).then((r) => r.data),
  update: (id: number, payload: CategoriaInput) =>
    api.put<Categoria>(`/api/Categoria/${id}`, payload).then((r) => r.data),
  remove: (id: number) => api.delete(`/api/Categoria/${id}`).then((r) => r.data),
};
