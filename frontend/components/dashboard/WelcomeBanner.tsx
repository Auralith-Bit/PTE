'use client';

import Link from 'next/link';
import Image from 'next/image';

interface WelcomeBannerProps {
  firstName: string;
}

export default function WelcomeBanner({ firstName }: WelcomeBannerProps) {
  return (
    <div className="relative bg-gradient-to-r from-[#EEF0FF] to-[#F3EFFF] rounded-2xl px-6 py-8 md:px-8 md:py-10 min-h-[240px] md:min-h-[280px] flex items-center overflow-hidden shadow-sm border border-indigo-100">
      {/* Text + CTAs */}
      <div className="z-10 max-w-[55%]">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 mb-2 leading-tight">
          <span className="mr-2">&#128075;</span>
          Welcome back, {firstName}!
        </h1>
        <p className="text-gray-500 text-[13px] md:text-[14px] mb-5 leading-relaxed">
          Keep practicing every day to achieve your target score.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/practice"
            id="continue-practice-btn"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold text-[14px] rounded-xl hover:bg-indigo-700 transition-all duration-150 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Continue Practice
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/mock-test"
            id="take-mock-test-btn"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 font-bold text-[14px] rounded-xl border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-150"
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
      <div className="absolute right-4 md:right-8 bottom-0 z-0 pointer-events-none">
        <Image
          src="/images/ChatGPT Image Aug 10, 2026, 03_34_56 PM 1.png"
          alt="Student studying"
          width={375}
          height={271}
          className="object-contain drop-shadow-lg h-auto w-[180px] sm:w-[240px] md:w-[300px]"
          priority
        />
      </div>
    </div>
  );
}
