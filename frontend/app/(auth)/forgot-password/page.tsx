'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { authApi } from '@/lib/api/auth';
import { errorMessage } from '@/lib/api/client';

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

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
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md">
          {sent ? (
            <>
              <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
                <CheckIcon />
              </div>
              <h1 className="text-[22px] font-bold text-gray-900 mb-2 text-center">Check Your Email</h1>
              <p className="text-[13px] text-gray-600 text-center leading-relaxed">
                If an account exists for <span className="font-semibold text-gray-800">{email.trim()}</span>{' '}
                and uses a password, we&apos;ve sent a link to reset it.
              </p>
              <p className="text-[13px] text-gray-500 text-center mt-3 leading-relaxed">
                The link expires in 60 minutes and can only be used once. If you don&apos;t see it,
                check your spam folder.
              </p>
              <button
                id="resend-btn"
                type="button"
                onClick={() => setSent(false)}
                className="w-full mt-5 bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-all text-[13px] shadow-md hover:-translate-y-0.5"
              >
                Use a different email
              </button>
            </>
          ) : (
            <>
              <h1 className="text-[22px] font-bold text-gray-900 mb-1">Reset Your Password</h1>
              <p className="text-gray-500 text-[13px] mb-5">
                Enter your email address and we&apos;ll send you a link to choose a new password.
              </p>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
                <div>
                  <div className={`flex items-center gap-2.5 border rounded-xl px-3 py-2.5 transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-brand'}`}>
                    <span className="text-gray-400"><MailIcon /></span>
                    <input
                      id="forgot-email"
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={e => { setEmail(e.target.value); if (error) setError(''); }}
                      className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400 text-gray-800"
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                  {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
                </div>

                <button
                  id="forgot-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-all duration-200 text-[13px] mt-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Sending...
                    </>
                  ) : 'Send Reset Link'}
                </button>
              </form>

              <div className="border-t border-gray-100 mt-5 pt-4">
                <Link href="/login" className="flex items-center justify-center gap-2 text-[13px] font-semibold text-gray-700 hover:text-brand transition-colors">
                  <ArrowLeftIcon />
                  Back to Log In
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
