import { api } from './client';
import type {
  OAuthExchangeResult,
  OAuthProviders,
  TokenPair,
  User,
  UserLogin,
  UserRegister,
} from '@/types';

export const authApi = {
  login: (email: string, password: string) =>
    api.post<TokenPair>('/auth/login', { email, password } satisfies UserLogin),
  register: (payload: UserRegister) =>
    api.post<User>('/auth/register', payload),
  refresh: (refreshToken: string) =>
    api.post<TokenPair>('/auth/refresh', { refresh_token: refreshToken }),
  me: () => api.get<User>('/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<{ message: string }>('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    }),
  oauthProviders: () => api.get<OAuthProviders>('/auth/oauth/providers'),
  exchangeOAuthCode: (code: string) =>
    api.post<OAuthExchangeResult>('/auth/oauth/exchange', { code }),
};
