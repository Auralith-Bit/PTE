import { api } from './client';
import type { TokenPair, User, UserLogin, UserRegister } from '@/types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<TokenPair>('/auth/login', { email, password } satisfies UserLogin),
  register: (payload: UserRegister) =>
    api.post<User>('/auth/register', payload),
  refresh: (refreshToken: string) =>
    api.post<TokenPair>('/auth/refresh', { refresh_token: refreshToken }),
  me: () => api.get<User>('/auth/me'),
};
