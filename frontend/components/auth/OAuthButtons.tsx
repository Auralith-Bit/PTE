'use client';

import { useEffect, useState } from 'react';

import { authApi } from '@/lib/api/auth';
import { API_BASE_URL } from '@/lib/api/client';
import { safeNextPath } from '@/lib/auth';

const PROVIDER_META: Record<string, { label: string; icon: React.ReactNode }> = {
  google: {
    label: 'Google',
    icon: (
      <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.698H24.48v8.883h12.958c-.558 3.006-2.25 5.554-4.796 7.265v6.04h7.766c4.543-4.185 7.124-10.35 7.124-17.49z" fill="#4285F4" />
        <path d="M24.48 48c6.504 0 11.956-2.157 15.942-5.844l-7.766-6.04c-2.155 1.445-4.91 2.297-8.176 2.297-6.288 0-11.615-4.245-13.514-9.954H2.952v6.24C6.92 42.689 15.143 48 24.48 48z" fill="#34A853" />
        <path d="M10.966 28.46A14.42 14.42 0 0 1 10.23 24c0-1.556.268-3.07.736-4.46V13.3H2.952A23.977 23.977 0 0 0 .48 24c0 3.868.926 7.527 2.472 10.7l8.014-6.24z" fill="#FBBC05" />
        <path d="M24.48 9.586c3.543 0 6.723 1.217 9.224 3.61l6.916-6.916C36.427 2.385 30.975 0 24.48 0 15.143 0 6.92 5.311 2.952 13.3l8.014 6.24c1.899-5.709 7.226-9.954 13.514-9.954z" fill="#EA4335" />
      </svg>
    ),
  },
  facebook: {
    label: 'Facebook',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M24 12.073C24 5.403 18.627 0 12 0S0 5.403 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" fill="#1877F2" />
      </svg>
    ),
  },
};

const ENABLED_BUTTON_CLASS =
  'flex items-center justify-center gap-3 w-full border border-gray-200 rounded-xl py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-sm';

const DISABLED_BUTTON_CLASS =
  'flex items-center justify-center gap-3 w-full border border-gray-200 rounded-xl py-2.5 text-[13px] font-medium text-gray-400 bg-gray-50 cursor-not-allowed select-none';

const PROVIDER_IDS = Object.keys(PROVIDER_META);

/**
 * Real Google/Facebook sign-in buttons.
 *
 * The section always renders so the layout does not change once sign-in is
 * enabled. A provider the backend has no credentials for is shown disabled with
 * an explanatory tooltip rather than hidden, and switches to a live link by
 * itself as soon as its client id and secret are present in backend/.env.
 */
export default function OAuthButtons({ verb = 'Continue' }: { verb?: string }) {
  const [enabled, setEnabled] = useState<string[] | null>(null);
  const [next, setNext] = useState<string | null>(null);

  useEffect(() => {
    // Sanitised here for tidiness; the backend re-checks it before use.
    const requested = safeNextPath(new URLSearchParams(window.location.search).get('next'), '');
    if (requested) setNext(requested);

    let cancelled = false;
    authApi
      .oauthProviders()
      .then((res) => {
        if (!cancelled) setEnabled(Object.keys(res.providers));
      })
      .catch(() => {
        if (!cancelled) setEnabled([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Wait for the first answer so buttons do not flash from disabled to enabled.
  if (enabled === null) return null;

  return (
    <>
      <div className="flex flex-col gap-2.5 mb-4">
        {PROVIDER_IDS.map((id) => {
          const meta = PROVIDER_META[id];
          const query = next ? `?next=${encodeURIComponent(next)}` : '';

          if (!enabled.includes(id)) {
            return (
              <button
                key={id}
                type="button"
                id={`${id}-oauth-btn`}
                disabled
                aria-disabled="true"
                title={`${meta.label} sign-in is not configured on this server yet.`}
                className={DISABLED_BUTTON_CLASS}
              >
                {meta.icon}
                {verb} with {meta.label}
              </button>
            );
          }

          return (
            <a
              key={id}
              id={`${id}-oauth-btn`}
              href={`${API_BASE_URL}/auth/oauth/${id}/start${query}`}
              className={ENABLED_BUTTON_CLASS}
            >
              {meta.icon}
              {verb} with {meta.label}
            </a>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[11px] text-gray-400 font-medium">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
    </>
  );
}
