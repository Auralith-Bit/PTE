'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { authApi } from '@/lib/api/auth';
import { errorMessage } from '@/lib/api/client';
import { setTokens, setUser } from '@/lib/auth';
import type { OAuthExchangeResult } from '@/types';

/**
 * The exchange code is single-use, so it must be redeemed exactly once. React
 * runs effects twice in development, so the request is memoised per code and
 * both runs share the same result rather than racing to redeem it.
 */
const inFlight = new Map<string, Promise<OAuthExchangeResult>>();

function exchangeOnce(code: string): Promise<OAuthExchangeResult> {
  const existing = inFlight.get(code);
  if (existing) return existing;
  const request = authApi.exchangeOAuthCode(code);
  inFlight.set(code, request);
  return request;
}

export default function OAuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const oauthError = params.get('error');

    if (oauthError) {
      setError(oauthError);
      return;
    }
    if (!code) {
      setError('Sign-in could not be completed. Please try again.');
      return;
    }

    let active = true;
    exchangeOnce(code)
      .then((result) => {
        if (!active) return;
        setTokens({
          access_token: result.access_token,
          refresh_token: result.refresh_token,
          token_type: result.token_type,
          expires_in: result.expires_in,
        });
        setUser(result.user);
        inFlight.delete(code);
        router.replace(result.next || '/dashboard');
      })
      .catch((err) => {
        if (!active) return;
        inFlight.delete(code);
        setError(errorMessage(err));
      });

    return () => {
      active = false;
    };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5 bg-gray-50">
        <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-lg text-center">
          <h1 className="text-[20px] font-bold text-gray-900 mb-2">Sign-in failed</h1>
          <p className="text-[13px] text-red-600 mb-6">{error}</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full rounded-xl bg-brand px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Back to Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-lg text-center">
        <h1 className="text-[20px] font-bold text-gray-900 mb-2">Signing you in</h1>
        <p className="text-[13px] text-gray-500">One moment while we finish setting up your account.</p>
        <div className="mt-5 flex justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-brand" />
        </div>
      </div>
    </div>
  );
}
