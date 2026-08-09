'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ─── Google Logo SVG ─────────────────────────────────────────────── */
const GoogleLogo = () => (
  <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.698H24.48v8.883h12.958c-.558 3.006-2.25 5.554-4.796 7.265v6.04h7.766c4.543-4.185 7.124-10.35 7.124-17.49z" fill="#4285F4"/>
    <path d="M24.48 48c6.504 0 11.956-2.157 15.942-5.844l-7.766-6.04c-2.155 1.445-4.91 2.297-8.176 2.297-6.288 0-11.615-4.245-13.514-9.954H2.952v6.24C6.92 42.689 15.143 48 24.48 48z" fill="#34A853"/>
    <path d="M10.966 28.46A14.42 14.42 0 0 1 10.23 24c0-1.556.268-3.07.736-4.46V13.3H2.952A23.977 23.977 0 0 0 .48 24c0 3.868.926 7.527 2.472 10.7l8.014-6.24z" fill="#FBBC05"/>
    <path d="M24.48 9.586c3.543 0 6.723 1.217 9.224 3.61l6.916-6.916C36.427 2.385 30.975 0 24.48 0 15.143 0 6.92 5.311 2.952 13.3l8.014 6.24c1.899-5.709 7.226-9.954 13.514-9.954z" fill="#EA4335"/>
  </svg>
);

const EyeOpenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

const SecurityIllustration = () => (
  <svg width="180" height="160" viewBox="0 0 180 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shield */}
    <path d="M90 10 L130 30 L130 75 C130 100 110 120 90 130 C70 120 50 100 50 75 L50 30 Z" fill="#1A73E8" opacity="0.9"/>
    <circle cx="90" cy="72" r="18" fill="white"/>
    <path d="M82 72 A8 8 0 0 1 90 64 A8 8 0 0 1 98 72 L98 80 L82 80 Z" fill="#1A73E8"/>
    <circle cx="90" cy="64" r="6" fill="#1A73E8"/>
    {/* Laptop */}
    <rect x="15" y="105" width="65" height="42" rx="4" fill="#F1F3F4"/>
    <rect x="20" y="110" width="55" height="32" fill="white"/>
    <rect x="10" y="147" width="75" height="5" rx="2.5" fill="#D2D2D2"/>
    {/* Play button on laptop */}
    <circle cx="47" cy="126" r="10" fill="#EA4335" opacity="0.9"/>
    <path d="M44 122 L54 126 L44 130 Z" fill="white"/>
    {/* Phone */}
    <rect x="100" y="100" width="30" height="52" rx="5" fill="#F1F3F4"/>
    <rect x="104" y="108" width="22" height="36" fill="white"/>
    <circle cx="115" cy="148" r="2" fill="#D2D2D2"/>
    {/* Map pin on phone */}
    <circle cx="115" cy="122" r="8" fill="#34A853" opacity="0.9"/>
    <path d="M115 116 C111 116 108 119 108 123 C108 128 115 135 115 135 C115 135 122 128 122 123 C122 119 119 116 115 116 Z" fill="#34A853"/>
    <circle cx="115" cy="123" r="3" fill="white"/>
    {/* Chat bubbles */}
    <rect x="55" y="88" width="28" height="16" rx="8" fill="#FBBC04"/>
    <path d="M63 104 L60 112 L68 107" fill="#FBBC04"/>
  </svg>
);

type Step = 'email' | 'password' | 'success';

export default function GoogleSigninPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  /* Step 1: Email */
  const handleEmailNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Enter a valid email or phone number');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setStep('password');
  };

  /* Step 2: Password */
  const handlePasswordNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setPasswordError('Wrong password. Try again or click Forgot Password to reset it.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setStep('success');
  };

  /* Step 3: Continue to PTE */
  const handleContinue = () => router.push('/dashboard');

  /* Shared card wrapper */
  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm w-full max-w-xl p-10">
        {children}
      </div>
      <div className="flex gap-6 mt-6 text-xs text-gray-500">
        <Link href="#" className="hover:underline">Help</Link>
        <Link href="/privacy" className="hover:underline">Privacy</Link>
        <Link href="/terms" className="hover:underline">Terms</Link>
      </div>
    </div>
  );

  /* ── STEP 1: Email ─────────────────────────────────────────────── */
  if (step === 'email') {
    return (
      <Card>
        <div className="mb-6"><GoogleLogo /></div>
        <h1 className="text-3xl font-normal text-gray-900 mb-2">Sign in</h1>
        <p className="text-base text-gray-600 mb-8">Use your Google Account</p>

        <form onSubmit={handleEmailNext} noValidate className="flex flex-col gap-5">
          <div>
            <div className={`border rounded-lg px-3 py-3 flex items-center gap-2 transition-colors ${emailError ? 'border-red-500' : 'border-gray-300 focus-within:border-brand'}`}>
              <input
                id="google-email"
                type="text"
                placeholder="Email or phone"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError(''); }}
                className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
                autoFocus
              />
              <span className="text-gray-400"><EyeOpenIcon /></span>
            </div>
            {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
          </div>

          <Link href="#" className="text-sm text-brand font-medium hover:underline">
            Forgot email?
          </Link>

          <p className="text-sm text-gray-600">
            Not your computer? Use Guest mode to sign in privately.{' '}
            <Link href="#" className="text-brand font-medium hover:underline">Learn more</Link>
          </p>

          <div className="flex items-center justify-between mt-2">
            <Link href="/signup" className="text-sm text-brand font-medium hover:underline">
              Create account
            </Link>
            <button
              id="google-email-next-btn"
              type="submit"
              disabled={loading}
              className="bg-brand hover:bg-brand-dark text-white font-medium px-8 py-2.5 rounded-full transition-all duration-200 text-sm disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : null}
              Next
            </button>
          </div>
        </form>
      </Card>
    );
  }

  /* ── STEP 2: Password ──────────────────────────────────────────── */
  if (step === 'password') {
    const initials = email.charAt(0).toUpperCase();
    return (
      <Card>
        <div className="mb-6"><GoogleLogo /></div>
        <h1 className="text-3xl font-normal text-gray-900 mb-6">Welcome</h1>

        {/* Account pill */}
        <div className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1.5 mb-8 cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <span className="text-sm text-gray-800">{email}</span>
          <ChevronDownIcon />
        </div>

        <form onSubmit={handlePasswordNext} noValidate className="flex flex-col gap-5">
          <div>
            <div className={`border-2 rounded-lg px-3 py-3 flex items-center gap-2 transition-colors ${passwordError ? 'border-red-500' : 'border-brand'}`}>
              <div className="flex-1">
                <label className="text-xs font-medium text-brand block mb-0.5">Enter your password</label>
                <input
                  id="google-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPasswordError(''); }}
                  className="w-full text-sm outline-none bg-transparent text-gray-800"
                  autoFocus
                />
              </div>
              <button type="button" onClick={() => setShowPassword(p => !p)} className="text-gray-400 hover:text-gray-600 transition-colors">
                {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            </div>
            {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
          </div>

          <Link href="#" className="text-sm text-brand font-medium hover:underline">
            Forgot Password?
          </Link>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showPasswordText}
              onChange={e => { setShowPasswordText(e.target.checked); setShowPassword(e.target.checked); }}
              className="w-4 h-4 rounded border-gray-300 accent-brand"
            />
            <span className="text-sm text-gray-700">Show password</span>
          </label>

          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={() => setStep('email')}
              className="text-sm text-brand font-medium hover:underline px-4 py-2.5"
            >
              Back
            </button>
            <button
              id="google-password-next-btn"
              type="submit"
              disabled={loading}
              className="bg-brand hover:bg-brand-dark text-white font-medium px-8 py-2.5 rounded-full transition-all duration-200 text-sm disabled:opacity-70 flex items-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : null}
              Next
            </button>
          </div>
        </form>
      </Card>
    );
  }

  /* ── STEP 3: Success ───────────────────────────────────────────── */
  return (
    <Card>
      <div className="flex items-start gap-8">
        {/* Left */}
        <div className="flex-1">
          <div className="mb-6"><GoogleLogo /></div>
          <h1 className="text-2xl font-normal text-gray-900 mb-4">You&apos;re signed in</h1>

          {/* Account pill */}
          <div className="inline-flex items-center gap-2 border border-gray-300 rounded-full px-3 py-1.5 mb-6 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{email.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-sm text-gray-800">{email}</span>
            <ChevronDownIcon />
          </div>

          <p className="text-sm text-gray-600">
            You can now close this window and return to PTE.Prep
          </p>
        </div>

        {/* Right: Illustration + CTA */}
        <div className="flex flex-col items-center gap-4">
          <SecurityIllustration />
          <p className="text-xs text-gray-500 text-center max-w-[160px]">
            Your account is protected with Google&apos;s advanced security.
          </p>
          <button
            id="google-continue-btn"
            onClick={handleContinue}
            className="bg-brand hover:bg-brand-dark text-white font-medium px-6 py-2.5 rounded-full transition-all duration-200 text-sm w-full"
          >
            Continue to PTE.Prep
          </button>
        </div>
      </div>
    </Card>
  );
}
