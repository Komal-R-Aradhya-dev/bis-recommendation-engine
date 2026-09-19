import { useCallback, useState } from "react";
import { login, register } from "@/services/auth.api";
import type { LoginRequest, RegisterRequest, AuthResponse } from "@/types/api";
import { clearToken, getToken, toFriendlyError } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  const isAuthenticated = Boolean(getToken());

  const handleLogin = useCallback(
    async (payload: LoginRequest): Promise<AuthResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await login(payload);

        if (response.user) {
          setUser(response.user);
        }

        return response;
      } catch (error: unknown) {
        const message = toFriendlyError(error);
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setUser],
  );

  const handleRegister = useCallback(
    async (payload: RegisterRequest): Promise<AuthResponse> => {
      setLoading(true);
      setError(null);

      try {
        const response = await register(payload);

        if (response.user) {
          setUser(response.user);
        }

        return response;
      } catch (error: unknown) {
        const message = toFriendlyError(error);
        setError(message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setUser],
  );

  const handleLogout = useCallback(() => {
    clearToken();
    clearUser();
    setError(null);
  }, [clearUser]);

  return {
    loading,
    error,
    user,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}
