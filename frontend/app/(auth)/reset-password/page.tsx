'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { authApi } from '@/lib/api/auth';
import { errorMessage } from '@/lib/api/client';
import { EyeClosedIcon, EyeOpenIcon } from '@/components/common/PasswordIcons';

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#EEEAF8] flex flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-8 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/images/PTElogo.png" alt="PTE Prep" width={50} height={50} className="rounded-full bg-[rgba(74,45,219,0.2)]" />
          <div>
            <span className="text-[22px] font-[800] tracking-tight">
              <span className="text-indigo-600">PTE.</span>
              <span className="text-indigo-600">Prep</span>
            </span>
            <p className="text-xs text-gray-500 -mt-0.5">Practice Smarter. Score Higher</p>
          </div>
        </Link>
        <p className="text-sm text-gray-600">
          Remembered it?{' '}
          <Link href="/login" className="text-brand font-semibold hover:underline">
            Back to log in
          </Link>
        </p>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-8 pb-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await authApi.resetPassword(token, form.password);
      setDone(true);
      setTimeout(() => router.push('/login?reset=1'), 2500);
    } catch (err) {
      setErrors({ form: errorMessage(err) });
      setLoading(false);
    }
  };

  // No token in the URL: nothing to redeem.
  if (!token) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <AlertIcon />
        </div>
        <h1 className="text-[22px] font-bold text-gray-900 mb-2">Link Not Recognised</h1>
        <p className="text-[13px] text-gray-600 leading-relaxed">
          This page needs a reset link from your email. Open the most recent &quot;Reset your
          PTE.Prep password&quot; email and follow the link inside it.
        </p>
        <Link
          href="/forgot-password"
          className="w-full mt-5 bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-all text-[13px] shadow-md hover:-translate-y-0.5 flex items-center justify-center"
        >
          Request a New Link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
          <CheckIcon />
        </div>
        <h1 className="text-[22px] font-bold text-gray-900 mb-2">Password Updated</h1>
        <p className="text-[13px] text-gray-600 leading-relaxed">
          You can now sign in with your new password. For your security, any other sessions
          have been signed out.
        </p>
        <Link
          href="/login?reset=1"
          className="w-full mt-5 bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-all text-[13px] shadow-md hover:-translate-y-0.5 flex items-center justify-center"
        >
          Go to Log In
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-[22px] font-bold text-gray-900 mb-1">Choose a New Password</h1>
      <p className="text-gray-500 text-[13px] mb-5">
        Pick something you haven&apos;t used before. This signs you out everywhere else.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        <div>
          <div className={`flex items-center gap-2.5 border rounded-xl px-3 py-2.5 transition-colors ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-brand'}`}>
            <span className="text-gray-400"><LockIcon /></span>
            <input
              id="new-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
              className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400 text-gray-800"
              autoComplete="new-password"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          </div>
          {errors.password
            ? <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>
            : <p className="text-xs text-gray-500 mt-1 ml-1">At least 8 characters</p>}
        </div>

        <div>
          <div className={`flex items-center gap-2.5 border rounded-xl px-3 py-2.5 transition-colors ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-brand'}`}>
            <span className="text-gray-400"><LockIcon /></span>
            <input
              id="confirm-password"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400 text-gray-800"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(p => !p)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword}</p>}
        </div>

        {errors.form && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-1">
            {errors.form}
          </p>
        )}

        <button
          id="reset-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-all duration-200 text-[13px] mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Updating...
            </>
          ) : 'Update Password'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Shell>
      <Suspense fallback={<p className="text-sm text-gray-500 text-center py-6">Loading...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </Shell>
  );
}
