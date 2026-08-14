'use client';

import { useCallback, useEffect, useState } from 'react';

import { authApi } from '@/lib/api/auth';
import { clearTokens, getUser, setTokens, setUser } from '@/lib/auth';
import type { User, UserRegister } from '@/types';

export function useAuth() {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUserState(getUser());
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const pair = await authApi.login(email, password);
    setTokens(pair);
    const me = await authApi.me();
    setUser(me);
    setUserState(me);
    return me;
  }, []);

  const register = useCallback(async (payload: UserRegister) => {
    const created = await authApi.register(payload);
    const pair = await authApi.login(payload.email, payload.password);
    setTokens(pair);
    setUser(created);
    setUserState(created);
    return created;
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUserState(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await authApi.me();
      setUser(me);
      setUserState(me);
      return me;
    } catch {
      logout();
      return null;
    }
  }, [logout]);

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };
}
