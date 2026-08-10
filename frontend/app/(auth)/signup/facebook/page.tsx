'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

const EyeOpenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const QuestionIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export default function FacebookSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '', lastName: '',
    month: 'January', day: '02', year: String(currentYear),
    gender: '',
    contact: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.gender) errs.gender = 'Please select a gender';
    if (!form.contact.trim()) errs.contact = 'Mobile number or email is required';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
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
          <Link href="/login" className="text-brand font-semibold hover:underline">Log in</Link>
        </p>
      </header>

      {/* ── Facebook Heading ── */}
      <div className="text-center mt-10 mb-6">
        <h1 className="text-5xl font-bold text-brand tracking-tight">facebook</h1>
      </div>

      {/* ── Card ── */}
      <div className="mx-auto w-full max-w-lg border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-8">
        {/* Card Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create a new account</h2>
          <p className="text-sm text-gray-500 mt-0.5">It&apos;s quick and eassy.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 flex flex-col gap-4">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                id="fb-firstName"
                name="firstName"
                type="text"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${errors.firstName ? 'border-red-400' : 'border-gray-300 focus:border-brand'}`}
              />
              {errors.firstName && <p className="text-xs text-red-500 mt-0.5">{errors.firstName}</p>}
            </div>
            <div>
              <input
                id="fb-lastName"
                name="lastName"
                type="text"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors ${errors.lastName ? 'border-red-400' : 'border-gray-300 focus:border-brand'}`}
              />
              {errors.lastName && <p className="text-xs text-red-500 mt-0.5">{errors.lastName}</p>}
            </div>
          </div>

          {/* Birthday */}
          <div>
            <div className="flex items-center gap-1 mb-1.5">
              <label className="text-sm font-medium text-gray-700">Birthday</label>
              <span className="text-gray-400 cursor-help" title="Your birthday is used to make sure you get the right Facebook experience.">
                <QuestionIcon />
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select
                name="month"
                value={form.month}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-2 py-2.5 text-sm outline-none focus:border-brand appearance-auto"
              >
                {months.map(m => <option key={m}>{m}</option>)}
              </select>
              <select
                name="day"
                value={form.day}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-2 py-2.5 text-sm outline-none focus:border-brand appearance-auto"
              >
                {days.map(d => <option key={d}>{d}</option>)}
              </select>
              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-2 py-2.5 text-sm outline-none focus:border-brand appearance-auto"
              >
                {years.map(y => <option key={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* Gender */}
          <div>
            <div className="flex items-center gap-1 mb-1.5">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <span className="text-gray-400 cursor-help" title="You can change who can see your gender on your profile.">
                <QuestionIcon />
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['Female', 'Male', 'Custom'].map(g => (
                <label
                  key={g}
                  className={`flex items-center justify-between border rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${form.gender === g ? 'border-brand bg-brand/5' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  <span className="text-sm text-gray-700">{g}</span>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={form.gender === g}
                    onChange={handleChange}
                    className="accent-brand"
                  />
                </label>
              ))}
            </div>
            {errors.gender && <p className="text-xs text-red-500 mt-0.5">{errors.gender}</p>}
          </div>

          {/* Contact */}
          <div>
            <div className={`flex items-center border rounded-lg px-3 py-2.5 transition-colors ${errors.contact ? 'border-red-400' : 'border-gray-300 focus-within:border-brand'}`}>
              <input
                id="fb-contact"
                name="contact"
                type="text"
                placeholder="Mobile number or email"
                value={form.contact}
                onChange={handleChange}
                className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400 text-gray-800"
              />
              <span className="text-gray-400 ml-2"><EyeOpenIcon /></span>
            </div>
            {errors.contact && <p className="text-xs text-red-500 mt-0.5">{errors.contact}</p>}
          </div>

          {/* Password */}
          <div>
            <div className={`flex items-center border rounded-lg px-3 py-2.5 transition-colors ${errors.password ? 'border-red-400' : 'border-gray-300 focus-within:border-brand'}`}>
              <input
                id="fb-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={form.password}
                onChange={handleChange}
                className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400 text-gray-800"
              />
              <button type="button" onClick={() => setShowPassword(p => !p)} className="text-gray-400 ml-2 hover:text-gray-600 transition-colors">
                {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>}
          </div>

          {/* Legal */}
          <p className="text-xs text-gray-500">
            People who use our service may have uploaded your contact information to Facebook.{' '}
            <Link href="#" className="text-brand hover:underline">Learn more.</Link>
          </p>
          <p className="text-xs text-gray-500">
            By clicking Sign Up, you agree to our Terms,{' '}
            <Link href="/privacy" className="text-brand hover:underline">Privacy Policy and Cookies Policy</Link>.
            You may receive SMS Notifications from us and can opt out any time.
          </p>

          {/* Submit */}
          <button
            id="fb-signup-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-all duration-200 text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Signing up...
              </>
            ) : 'Sign up'}
          </button>

          <div className="text-center">
            <Link href="/login" className="text-sm font-bold text-brand hover:underline">
              Already have a profile?
            </Link>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <Link href="/" className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 hover:text-brand transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Go to the Home Page
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
