// src/services/api.ts

import axios, { type AxiosError } from "axios";

// Backend URL comes from frontend/.env
// Example: VITE_API_URL=http://localhost:5000/api
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

const TOKEN_KEY = "bis_auth_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Attach JWT automatically.
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Friendly, non-leaking error messages.
function firstServerMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const payload = data as { message?: unknown; errors?: unknown };

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  if (payload.errors && typeof payload.errors === "object") {
    const first = Object.values(payload.errors as Record<string, unknown>).find(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    );

    if (first) {
      return first;
    }
  }

  return null;
}

export function toFriendlyError(error: unknown): string {
  if (axios.isCancel(error)) {
    return "Generation stopped.";
  }

  const err = error as AxiosError<{ message?: string; errors?: Record<string, string> }>;

  if (
    err.code === "ERR_CANCELED" ||
    err.name === "AbortError" ||
    err.name === "CanceledError"
  ) {
    return "Generation stopped.";
  }

  if (!err.response) {
    return "Network error. Please check your connection and try again.";
  }

  const serverMessage = firstServerMessage(err.response.data);

  switch (err.response.status) {
    case 400:
      return (
        serverMessage ??
        "Please provide a query or a tender document to analyze."
      );

    case 401:
      return serverMessage ?? "Your session has expired. Please log in again.";

    case 502:
      return (
        serverMessage ??
        "The service is temporarily unavailable. Please try again shortly."
      );

    case 504:
      return (
        serverMessage ??
        "The analysis is taking longer than expected. Please try again."
      );

    default:
      return serverMessage ?? "Something went wrong. Please try again.";
  }
}

// Clear token on unauthorized response.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearToken();
    }

    return Promise.reject(error);
  },
);
