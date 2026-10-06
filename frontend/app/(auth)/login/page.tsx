'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import { errorMessage } from '@/lib/api/client';
import { requestedNextPath } from '@/lib/auth';

import OAuthButtons from '@/components/auth/OAuthButtons';
import { EyeClosedIcon, EyeOpenIcon } from '@/components/common/PasswordIcons';

/* ─── SVG Icons ──────────────────────────────────────────────────── */
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: 'AI-Powered Feedback',
    desc: 'Get instant, intelligent scoring on every answer.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Timed Mock Tests',
    desc: 'Simulate real PTE exam conditions and timing.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Score Analytics',
    desc: 'Track your growth and spot weak areas fast.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: '50,000+ Students',
    desc: 'Join a global community of PTE achievers.',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace(requestedNextPath());
  }, [isAuthenticated, router]);

  // Read the flag without useSearchParams so this page keeps its current shape.
  useEffect(() => {
    setPasswordReset(new URLSearchParams(window.location.search).get('reset') === '1');
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      errs.email = 'Please enter a valid email address';
    if (!form.password)
      errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      router.push(requestedNextPath());
    } catch (err) {
      setErrors({ form: errorMessage(err) });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEEAF8] flex flex-col">
      {/* ── Top Bar ── */}
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
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-brand font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </header>

      {/* ── Main ── */}
      <main className="flex flex-col lg:flex-row flex-1 items-center justify-between max-w-7xl mx-auto w-full px-4 sm:px-8 pb-10 gap-8">
        {/* Left: Hero */}
        <div className="flex-1 max-w-lg w-full min-w-0">
          <h1 className="text-[32px] font-bold text-gray-900 leading-tight mb-4">
            Welcome Back to<br />
            <span className="text-brand">PTE Success</span><br />
            Journey
          </h1>
          <p className="text-gray-600 text-[15px] mb-8 max-w-sm">
            Log in to continue your AI-powered PTE preparation, access your mock tests, and track your progress.
          </p>

          <div className="flex flex-col gap-5">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-brand text-sm">{f.title}</h3>
                  <p className="text-gray-600 text-[13px]">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md lg:shrink-0">
          <h2 className="text-[22px] font-bold text-gray-900 mb-1">Log In</h2>
          <p className="text-gray-500 text-[13px] mb-5">
            Welcome back! Please enter your details.
          </p>

          <OAuthButtons verb="Continue" />

          {passwordReset && (
            <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-3">
              Your password has been reset. Please sign in with your new password.
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
            {/* Email */}
            <div>
              <div className={`flex items-center gap-2.5 border rounded-xl px-3 py-2.5 transition-colors ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-brand'}`}>
                <span className="text-gray-400"><MailIcon /></span>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400 text-gray-800"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className={`flex items-center gap-2.5 border rounded-xl px-3 py-2.5 transition-colors ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-brand'}`}>
                <span className="text-gray-400"><LockIcon /></span>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400 text-gray-800"
                  autoComplete="current-password"
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
              {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
            </div>

            {/* Remember Me + Forgot */}
            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-brand"
                />
                <span className="text-xs text-gray-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-xs text-brand font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            {errors.form && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mt-1">
                {errors.form}
              </p>
            )}
            <button
              id="login-submit-btn"
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
                  Logging in...
                </>
              ) : 'Log In'}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-brand font-semibold hover:underline">
              Sign up for free
            </Link>
          </p>

          <div className="border-t border-gray-100 mt-5 pt-4">
            <Link href="/" className="flex items-center justify-center gap-2 text-[13px] font-semibold text-gray-700 hover:text-brand transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Go to the Home Page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
