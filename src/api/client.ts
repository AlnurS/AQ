import axios from "axios";

import type { ApiErrorShape } from "../types/api";

export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL?.trim() || "http://127.0.0.1:8000").replace(/\/+$/, "");

export function resolveApiUrl(path: string): string {
  return new URL(path, `${apiBaseUrl}/`).toString();
}

export class ApiError extends Error {
  public readonly status?: number;

  public constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15_000,
  headers: { Accept: "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError<ApiErrorShape>(error)) {
      const detail = error.response?.data?.detail ?? error.response?.data?.message;
      return Promise.reject(
        new ApiError(detail ?? error.message ?? "The backend request failed.", error.response?.status),
      );
    }
    return Promise.reject(new ApiError("An unexpected client error occurred."));
  },
);
