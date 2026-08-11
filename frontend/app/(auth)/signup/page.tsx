'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

/* ─── SVG Icons ──────────────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.698H24.48v8.883h12.958c-.558 3.006-2.25 5.554-4.796 7.265v6.04h7.766c4.543-4.185 7.124-10.35 7.124-17.49z" fill="#4285F4"/>
    <path d="M24.48 48c6.504 0 11.956-2.157 15.942-5.844l-7.766-6.04c-2.155 1.445-4.91 2.297-8.176 2.297-6.288 0-11.615-4.245-13.514-9.954H2.952v6.24C6.92 42.689 15.143 48 24.48 48z" fill="#34A853"/>
    <path d="M10.966 28.46A14.42 14.42 0 0 1 10.23 24c0-1.556.268-3.07.736-4.46V13.3H2.952A23.977 23.977 0 0 0 .48 24c0 3.868.926 7.527 2.472 10.7l8.014-6.24z" fill="#FBBC05"/>
    <path d="M24.48 9.586c3.543 0 6.723 1.217 9.224 3.61l6.916-6.916C36.427 2.385 30.975 0 24.48 0 15.143 0 6.92 5.311 2.952 13.3l8.014 6.24c1.899-5.709 7.226-9.954 13.514-9.954z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073C24 5.403 18.627 0 12 0S0 5.403 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" fill="#1877F2"/>
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

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

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.16Z"/>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.16Z"/>
      </svg>
    ),
    title: 'AI-Powered Learning',
    desc: 'Get intelligent feedback and personalized suggestions.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 9h.01M15 9h.01M9 15h.01M15 15h.01M9 12h6"/>
      </svg>
    ),
    title: 'Real Exam Simulation',
    desc: 'Practice with real PTE exam format and timing.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: 'Track Your Progress',
    desc: 'Analyze your performance and improve every day.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
      </svg>
    ),
    title: 'Practice Anytime, Anywhere',
    desc: 'Access all tools on any device, anytime you want.',
  },
];

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email is required';
    if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!agreed) newErrors.agreed = 'You must agree to the Terms of Service';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#EEEAF8] flex flex-col">
      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between px-8 py-4">
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
          Already have an account?{' '}
          <Link href="/login" className="text-brand font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </header>

      {/* ── Main Content ── */}
      <main className="flex flex-1 items-start justify-between max-w-7xl mx-auto w-full px-8 pb-8 gap-8">
        {/* Left: Hero */}
        <div className="flex-1 pt-8 max-w-lg">
          <h1 className="text-[32px] font-bold text-gray-900 leading-tight mb-4">
            Start Your<br />
            <span className="text-brand">PTE Success</span><br />
            Journey
          </h1>
          <p className="text-gray-600 text-[15px] mb-8 max-w-sm">
            Create your account and get unlimited access to AI-powered practice, mock tests, expert courses and smart learning tools.
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

        {/* Right: Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md shrink-0">
          <h2 className="text-[22px] font-bold text-gray-900 mb-1">Create Your Account</h2>
          <p className="text-gray-500 text-[13px] mb-5">Join PTE.Prep and start preparing today!</p>

          {/* OAuth Buttons */}
          <div className="flex flex-col gap-2.5 mb-4">
            <Link
              href="/signup/google"
              id="signup-google-btn"
              className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-xl py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
            >
              <GoogleIcon />
              Sign up with Google
            </Link>
            <Link
              href="/signup/facebook"
              id="signup-facebook-btn"
              className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-xl py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
            >
              <FacebookIcon />
              Sign up with Facebook
            </Link>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11px] text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
            {/* Full Name */}
            <div>
              <div className={`flex items-center gap-2.5 border rounded-xl px-3 py-2.5 transition-colors ${errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-brand'}`}>
                <span className="text-gray-400"><UserIcon /></span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400 text-gray-800"
                />
              </div>
              {errors.fullName && <p className="text-xs text-red-500 mt-1 ml-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <div className={`flex items-center gap-2.5 border rounded-xl px-3 py-2.5 transition-colors ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-brand'}`}>
                <span className="text-gray-400"><MailIcon /></span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400 text-gray-800"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className={`flex items-center gap-2.5 border rounded-xl px-3 py-2.5 transition-colors ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-brand'}`}>
                <span className="text-gray-400"><LockIcon /></span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400 text-gray-800"
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <div className={`flex items-center gap-2.5 border rounded-xl px-3 py-2.5 transition-colors ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-200 focus-within:border-brand'}`}>
                <span className="text-gray-400"><LockIcon /></span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400 text-gray-800"
                />
                <button type="button" onClick={() => setShowConfirmPassword(p => !p)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  id="terms-checkbox"
                  type="checkbox"
                  checked={agreed}
                  onChange={e => { setAgreed(e.target.checked); if (errors.agreed) setErrors(p => ({ ...p, agreed: '' })); }}
                  className="w-4 h-4 rounded border-gray-300 accent-brand"
                />
                <span className="text-xs text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-brand font-semibold hover:underline">Terms of Service</Link>
                  {'  '}
                  <Link href="/privacy" className="text-brand font-semibold hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.agreed && <p className="text-xs text-red-500 mt-1 ml-1">{errors.agreed}</p>}
            </div>

            {/* Submit */}
            <button
              id="signup-submit-btn"
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
                  Creating account...
                </>
              ) : 'Sign up'}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-brand hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-brand hover:underline">Privacy Policy</Link>.
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
