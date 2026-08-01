"use client";

import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { API_URL } from "@/lib/utils";
import type { ApiResponse, AuthTokens, User } from "@/types";

const ACCESS_KEY = "sss_access_token";
const REFRESH_KEY = "sss_refresh_token";
const USER_KEY = "sss_user";

export const tokenStore = {
  getAccess: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_KEY);
  },
  getRefresh: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_KEY);
  },
  set: (tokens: AuthTokens) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getUser: (): User | null => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
  setUser: (user: User) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
};

export class ApiError extends Error {
  statusCode: number;
  errors?: unknown;

  constructor(message: string, statusCode: number, errors?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return null;

  try {
    const response = await axios.post<ApiResponse<AuthTokens & { user: User }>>(`${API_URL}/auth/refresh-token`, {
      refreshToken,
    });
    const { accessToken, refreshToken: newRefresh } = response.data.data;
    tokenStore.set({ accessToken, refreshToken: newRefresh });
    if (response.data.data.user) {
      tokenStore.setUser(response.data.data.user);
    }
    return accessToken;
  } catch {
    return null;
  }
};

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && original && !original._retry && !original.url?.includes("/auth/")) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      const newToken = await refreshAccessToken();
      processQueue(newToken ? null : new Error("Refresh failed"), newToken);
      isRefreshing = false;

      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }

      tokenStore.clear();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiResponse | undefined;
    if (data?.message) return data.message;
    if (error.response?.status === 401) return "Your session has expired. Please login again.";
    if (error.response?.status === 403) return "You do not have permission to perform this action.";
    if (error.response?.status === 404) return "Resource not found.";
    if (error.response?.status === 409) return "This record already exists.";
    if (error.response?.status === 429) return "Too many requests. Please try again later.";
    if (error.code === "ECONNABORTED") return "Request timed out. Please try again.";
    if (error.code === "ERR_NETWORK") return "Cannot reach the server. Please check your connection.";
    return error.message || "Something went wrong.";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
};

export async function apiRequest<T = unknown>(
  method: "get" | "post" | "patch" | "put" | "delete",
  url: string,
  data?: unknown,
  config?: Parameters<AxiosInstance["request"]>[0]
): Promise<T> {
  try {
    const response = await api.request<T>({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default api;
