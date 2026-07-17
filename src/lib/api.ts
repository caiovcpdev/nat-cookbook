// ============================================================================
// Central HTTP client. All API calls go through this instance so that:
//  - Auth token is injected in one place (interceptor)
//  - Base URL is configurable via VITE_API_BASE_URL
//  - Errors are normalized before hitting UI code
// This module is browser-safe and free of DOM APIs beyond localStorage, so it
// can be swapped for AsyncStorage in a React Native port with minimal work.
// ============================================================================

import axios, { AxiosError, AxiosInstance } from "axios";
import { STORAGE_KEYS } from "@/constants";

const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://localhost:7104";

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ---- Token storage (isolated so the platform layer can be swapped) --------
export const tokenStorage = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(STORAGE_KEYS.token);
  },
  set(token: string, expiraEm?: string) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEYS.token, token);
    if (expiraEm) window.localStorage.setItem(STORAGE_KEYS.tokenExp, expiraEm);
  },
  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEYS.token);
    window.localStorage.removeItem(STORAGE_KEYS.tokenExp);
  },
};

// ---- Request: attach bearer -----------------------------------------------
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Response: normalize errors -------------------------------------------
export class ApiError extends Error {
  status?: number;
  data?: unknown;
  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError<{ mensagem?: string; message?: string; title?: string }>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      tokenStorage.clear();
    }
    const data = error.response?.data;
    const message =
      data?.mensagem ||
      data?.message ||
      data?.title ||
      error.message ||
      "Erro inesperado ao consultar o servidor.";
    return Promise.reject(new ApiError(message, error.response?.status, data));
  },
);
