'use client';

import Link from 'next/link';
import Image from 'next/image';

interface WelcomeBannerProps {
  firstName: string;
}

export default function WelcomeBanner({ firstName }: WelcomeBannerProps) {
  return (
    <div className="relative bg-gradient-to-r from-[#EEF0FF] to-[#F3EFFF] rounded-2xl overflow-hidden shadow-sm border border-indigo-100">
      <div className="flex items-center gap-[70px] px-8 py-6 md:px-10 md:py-8 min-h-[216px]">

        {/* Text + CTAs — 574px × 216px */}
        <div className="z-10 shrink-0" style={{ width: 574, height: 216 }}>
          <h1 className="text-[28px] font-extrabold text-gray-800 leading-tight mb-2">
            <span className="mr-1">&#128075;</span>
            Welcome back, {firstName}!
          </h1>
          <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
            Keep practicing every day to achieve your target score.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/practice"
              id="continue-practice-btn"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold text-[14px] rounded-xl hover:bg-indigo-700 transition-all duration-150 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Continue Practice
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/mock-test"
              id="take-mock-test-btn"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-bold text-[14px] rounded-xl border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-150"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Take Mock Test
            </Link>
          </div>
        </div>

        {/* Illustration */}
        <div className="z-0 pointer-events-none shrink-0">
          <Image
            src="/images/ChatGPT Image Aug 10, 2026, 03_34_56 PM 1.png"
            alt="Student studying"
            width={375}
            height={271}
            className="object-contain drop-shadow-lg h-auto w-[200px]"
            priority
          />
        </div>
      </div>
    </div>
  );
}
