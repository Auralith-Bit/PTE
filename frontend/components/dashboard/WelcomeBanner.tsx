'use client';

import Link from 'next/link';
import Image from 'next/image';

interface WelcomeBannerProps {
  firstName: string;
}

export default function WelcomeBanner({ firstName }: WelcomeBannerProps) {
  return (
    <div className="relative bg-gradient-to-r from-[#F0F1FF] to-[#F5F0FF] rounded-2xl pl-8 pr-0 py-8 md:pl-10 md:py-9 min-h-[220px] flex items-center justify-between overflow-visible shadow-sm">
      {/* Text + CTAs */}
      <div className="z-10 flex flex-col justify-center gap-1">
        <h1 className="text-[26px] md:text-[30px] font-extrabold text-gray-900 leading-tight">
          <span className="mr-1">&#128075;</span>
          Welcome back, {firstName}!
        </h1>
        <p className="text-gray-500 text-[15px] leading-relaxed mb-5">
          Keep practicing every day to achieve your target score.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/practice"
            id="continue-practice-btn"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#4F46E5] text-white font-bold text-[15px] rounded-xl hover:bg-[#4338CA] transition-all duration-150 shadow-md hover:shadow-lg"
          >
            Continue Practice
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/mock-test"
            id="take-mock-test-btn"
            className="inline-flex items-center gap-2 px-7 py-3 bg-white text-[#4F46E5] font-bold text-[15px] rounded-xl border-2 border-[#4F46E5] hover:bg-[#F0F1FF] transition-all duration-150"
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
      <div className="shrink-0 self-end z-0 pointer-events-none">
        <Image
          src="/images/ChatGPT Image Aug 10, 2026, 03_34_56 PM 1.png"
          alt="Student studying"
          width={375}
          height={271}
          className="object-contain drop-shadow-lg h-auto w-[220px] md:w-[280px]"
          priority
        />
      </div>
    </div>
  );
}
