export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface AuthApiResponse {
  success: boolean;
  message: string;
  data: AuthResponse;
}

export interface RecommendationRequestParams {
  query?: string;
  document?: File;
  limit?: number;
}

export interface ApiErrorShape {
  status: number;
  message: string;
}
