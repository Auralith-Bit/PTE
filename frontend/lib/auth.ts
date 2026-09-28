import type { TokenPair, User } from '@/types';

const ACCESS_TOKEN_KEY = 'pte_access_token';
const REFRESH_TOKEN_KEY = 'pte_refresh_token';
const USER_KEY = 'pte_user';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(pair: TokenPair): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, pair.access_token);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, pair.refresh_token);
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user === null) {
    window.localStorage.removeItem(USER_KEY);
  } else {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

/** Keep a post-login redirect on this site: relative paths only, never a host. */
export function safeNextPath(value: string | null | undefined, fallback = '/dashboard'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return fallback;
  return value;
}

/** Where to send the user after a successful sign-in, honouring ?next=. */
export function requestedNextPath(): string {
  if (typeof window === 'undefined') return '/dashboard';
  return safeNextPath(new URLSearchParams(window.location.search).get('next'));
}
