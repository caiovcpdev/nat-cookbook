import { api } from "@/lib/api";
import type { CadastroRequest, LoginRequest, LoginResponse, Usuario } from "@/types";

export const authService = {
  login: (payload: LoginRequest) =>
    api.post<LoginResponse>("/api/Auth/login", payload).then((r) => r.data),
  cadastrar: (payload: CadastroRequest) =>
    api.post<Usuario>("/api/Usuario", payload).then((r) => r.data),
  perfil: () => api.get<Usuario>("/api/Usuario/perfil").then((r) => r.data),
};
