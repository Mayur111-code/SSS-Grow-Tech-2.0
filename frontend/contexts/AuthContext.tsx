"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import api, { tokenStore } from "@/lib/api";
import { getErrorMessage } from "@/lib/api";
import { API_URL } from "@/lib/utils";
import type { ApiResponse, AuthTokens, User } from "@/types";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  googleLogin: (token: string) => Promise<User>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const persistSession = (data: AuthTokens & { user: User }) => {
  tokenStore.set({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  tokenStore.setUser(data.user);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = tokenStore.getUser();
    const token = tokenStore.getAccess();

    if (storedUser && token) {
      setUserState(storedUser);
    }

    const refreshProfile = async () => {
      if (!tokenStore.getAccess()) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.get<ApiResponse<User>>("/auth/me");
        const me = response.data.data;
        setUserState(me);
        tokenStore.setUser(me);
      } catch {
        tokenStore.clear();
        setUserState(null);
      } finally {
        setIsLoading(false);
      }
    };

    refreshProfile();

    const handleLogoutEvent = () => {
      setUserState(null);
    };
    window.addEventListener("auth:logout", handleLogoutEvent);
    return () => window.removeEventListener("auth:logout", handleLogoutEvent);
  }, []);

  const setUser = useCallback((nextUser: User) => {
    setUserState(nextUser);
    tokenStore.setUser(nextUser);
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<User> => {
    const response = await axios.post<ApiResponse<AuthTokens & { user: User }>>(
      `${API_URL}/auth/login`,
      payload
    );
    persistSession(response.data.data);
    setUserState(response.data.data.user);
    return response.data.data.user;
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<User> => {
    const response = await axios.post<ApiResponse<AuthTokens & { user: User }>>(
      `${API_URL}/auth/register`,
      payload
    );
    persistSession(response.data.data);
    setUserState(response.data.data.user);
    return response.data.data.user;
  }, []);

  const googleLogin = useCallback(async (googleToken: string): Promise<User> => {
    const response = await axios.post<ApiResponse<AuthTokens & { user: User }>>(
      `${API_URL}/auth/google`,
      { token: googleToken }
    );
    persistSession(response.data.data);
    setUserState(response.data.data.user);
    return response.data.data.user;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch {
      // ignore
    }
    tokenStore.clear();
    setUserState(null);
  }, []);

  const refreshProfile = useCallback(async (): Promise<void> => {
    try {
      const response = await api.get<ApiResponse<User>>("/auth/me");
      setUserState(response.data.data);
      tokenStore.setUser(response.data.data);
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        googleLogin,
        logout,
        setUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
