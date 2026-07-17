import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService } from "@/services/authService";
import { tokenStorage } from "@/lib/api";
import type { LoginRequest, Usuario } from "@/types";

interface AuthContextValue {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  isLoadingProfile: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<Usuario | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Hydrate token from storage on mount (client only, avoids SSR mismatch).
  useEffect(() => {
    const stored = tokenStorage.get();
    setToken(stored);
    setIsHydrating(false);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!tokenStorage.get()) return;
    setIsLoadingProfile(true);
    try {
      const perfil = await authService.perfil();
      setUser(perfil);
    } catch {
      // Token expired / API down — do not spam the user; drop the session.
      tokenStorage.clear();
      setToken(null);
      setUser(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    if (token) void refreshProfile();
    else setUser(null);
  }, [token, refreshProfile]);

  const login = useCallback(async (payload: LoginRequest) => {
    const res = await authService.login(payload);
    tokenStorage.set(res.token, res.expiraEm);
    setToken(res.token);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      isHydrating,
      isLoadingProfile,
      login,
      logout,
      refreshProfile,
    }),
    [user, token, isHydrating, isLoadingProfile, login, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
