'use client';

import Link from 'next/link';
import Image from 'next/image';

interface WelcomeBannerProps {
  firstName: string;
}

export default function WelcomeBanner({ firstName }: WelcomeBannerProps) {
  return (
    <div
      className="relative rounded-2xl flex items-center overflow-visible shadow-sm"
      style={{
        width: 986,
        height: 280,
        padding: '3px 22px 0 22px',
        gap: 20,
        background: `linear-gradient(90deg, rgba(244,244,244,0.2) 0%, rgba(246,246,246,0.2) 24.69%, rgba(246,246,246,0.2) 50%, rgba(246,246,246,0.2) 66.43%, rgba(28,5,146,0.2) 100%),
                     linear-gradient(89.01deg, rgba(48,8,248,0.03) 0.14%, rgba(48,8,248,0.03) 100.8%)`
      }}
    >
      {/* Text + CTAs */}
      <div className="z-10 flex flex-col justify-center">
        <h1 className="text-[26px] md:text-[30px] font-extrabold text-gray-900 leading-tight mb-2">
          <span className="mr-1">&#128075;</span>
          Welcome back, {firstName}!
        </h1>
        <p className="text-gray-500 text-[15px] leading-relaxed mb-7">
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
