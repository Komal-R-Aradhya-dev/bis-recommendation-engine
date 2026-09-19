import { api, setToken } from "./api";
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  AuthApiResponse,
} from "@/types/api";

export async function register(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthApiResponse>("/auth/register", payload);

  const authData = data.data;

  if (authData.token) {
    setToken(authData.token);
  }

  return authData;
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthApiResponse>("/auth/login", payload);

  const authData = data.data;

  if (authData.token) {
    setToken(authData.token);
  }

  return authData;
}
