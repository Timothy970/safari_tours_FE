'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (data: { full_name: string; email: string; phone_number: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: (redirectUrl?: string) => void;
  refreshSession: () => Promise<boolean>;
  updateRewardPoints: (pointsDelta: number) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isGuideOrAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  refreshSession: async () => false,
  updateRewardPoints: () => {},
  isAuthenticated: false,
  isAdmin: false,
  isGuideOrAdmin: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback((redirectUrl?: string) => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kibali_user');
      localStorage.removeItem('kibali_access_token');
      localStorage.removeItem('kibali_refresh_token');

      const currentPath = window.location.pathname;
      const isProtected = currentPath.startsWith('/portal') || currentPath.startsWith('/admin') || currentPath.startsWith('/book');

      if (typeof redirectUrl === 'string' && redirectUrl.trim().length > 0) {
        window.location.href = redirectUrl;
      } else if (isProtected) {
        window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
      } else {
        window.location.href = '/';
      }
    }
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    const refreshToken = localStorage.getItem('kibali_refresh_token');
    if (!refreshToken) {
      logout();
      return false;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.access_token) {
          setToken(data.access_token);
          localStorage.setItem('kibali_access_token', data.access_token);
          if (data.refresh_token) {
            localStorage.setItem('kibali_refresh_token', data.refresh_token);
          }
          if (data.user) {
            setUser(data.user);
            localStorage.setItem('kibali_user', JSON.stringify(data.user));
          }
          return true;
        }
      }
      logout();
      return false;
    } catch {
      // Network hiccup - if tokens exist keep for retry, else logout
      return false;
    }
  }, [logout]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('kibali_user');
      const storedToken = localStorage.getItem('kibali_access_token');

      console.log('[AuthContext] Initializing auth state...', {
        hasStoredUser: Boolean(storedUser),
        hasStoredToken: Boolean(storedToken),
      });

      if (storedUser && storedToken) {
        try {
          const parsed = JSON.parse(storedUser);
          console.log('[AuthContext] Restored user session:', parsed?.email || parsed?.id);
          setUser(parsed);
          setToken(storedToken);
        } catch (e) {
          console.error('[AuthContext] Failed to parse stored user, clearing auth session:', e);
          logout();
        }
      } else {
        console.log('[AuthContext] No active stored session found.');
        setUser(null);
        setToken(null);
      }

      // Event listener for token refreshed by API interceptor
      const handleTokenRefreshed = (e: any) => {
        console.log('[AuthContext] Received event: kibali_token_refreshed', e.detail);
        if (e.detail?.token) setToken(e.detail.token);
        if (e.detail?.user) setUser(e.detail.user);
      };

      // Event listener for forced logout on session expiry
      const handleAuthLogout = () => {
        console.warn('[AuthContext] Received event: kibali_auth_logout');
        logout();
      };

      window.addEventListener('kibali_token_refreshed', handleTokenRefreshed);
      window.addEventListener('kibali_auth_logout', handleAuthLogout);

      console.log('[AuthContext] Auth initialization finished -> setting isLoading = false');
      setIsLoading(false);

      return () => {
        window.removeEventListener('kibali_token_refreshed', handleTokenRefreshed);
        window.removeEventListener('kibali_auth_logout', handleAuthLogout);
      };
    } else {
      setIsLoading(false);
    }
  }, [logout]);

  // Proactive background auto-refresh every 12 minutes while active
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      refreshSession();
    }, 12 * 60 * 1000); // 12 minutes

    return () => clearInterval(interval);
  }, [token, refreshSession]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.access_token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('kibali_user', JSON.stringify(data.user));
          localStorage.setItem('kibali_access_token', data.access_token);
          if (data.refresh_token) {
            localStorage.setItem('kibali_refresh_token', data.refresh_token);
          }
        }
        return { success: true, user: data.user };
      } else {
        const errData = await res.json().catch(() => ({}));
        return { success: false, error: errData.error || 'Invalid credentials' };
      }
    } catch {
      return { success: false, error: 'Cannot connect to authentication server' };
    }
  };

  const register = async (data: {
    full_name: string;
    email: string;
    phone_number: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const resData = await res.json();
        setUser(resData.user);
        setToken(resData.access_token);
        if (typeof window !== 'undefined') {
          localStorage.setItem('kibali_user', JSON.stringify(resData.user));
          localStorage.setItem('kibali_access_token', resData.access_token);
          if (resData.refresh_token) {
            localStorage.setItem('kibali_refresh_token', resData.refresh_token);
          }
        }
        return { success: true };
      } else {
        const errData = await res.json().catch(() => ({}));
        return { success: false, error: errData.error || 'Registration failed' };
      }
    } catch {
      return { success: false, error: 'Cannot connect to authentication server' };
    }
  };

  const updateRewardPoints = (pointsDelta: number) => {
    if (!user) return;
    const updated = {
      ...user,
      reward_points: (user.reward_points || 0) + pointsDelta,
    };
    setUser(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kibali_user', JSON.stringify(updated));
    }
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isGuideOrAdmin = user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'trip_leader';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshSession,
        updateRewardPoints,
        isAuthenticated,
        isAdmin,
        isGuideOrAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
