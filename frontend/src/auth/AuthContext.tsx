import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService, type AuthSnapshot } from "./AuthService.ts";

export interface AuthContextValue extends AuthSnapshot {
  login: typeof authService.login;
  logout: typeof authService.logout;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<AuthSnapshot>(authService.state);

  useEffect(() => {
    return authService.subscribe(setSnapshot);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...snapshot,
      login: (data) => authService.login(data),
      logout: () => authService.logout(),
    }),
    [snapshot]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
