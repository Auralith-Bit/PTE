'use client';

import Link from 'next/link';

interface RecentMockTestProps {
  name: string;
  score: number;
  completedLabel: string;
}

export default function RecentMockTest({ name, score, completedLabel }: RecentMockTestProps) {
  const scoreColor =
    score >= 79 ? 'text-green-600' : score >= 65 ? 'text-indigo-600' : 'text-orange-500';

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-[15px] font-extrabold text-gray-800">Recent Mock Test</h2>
      </div>

      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-[14px] font-bold text-gray-700">{name}</p>
          <p className="text-[12px] text-gray-400">{completedLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Score</p>
          <p className={`text-[22px] font-extrabold ${scoreColor}`}>{score}</p>
        </div>
      </div>

      <Link
        href="/mock-test"
        id="view-report-btn"
        className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] rounded-xl py-2.5 mt-3 transition-colors shadow-sm"
      >
        View Report
      </Link>
    </div>
  );
}
