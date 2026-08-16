'use client';

import Link from 'next/link';

interface TodayGoalProps {
  description: string;
  goalDone: number;
  goalTotal: number;
}

export default function TodayGoal({ description, goalDone, goalTotal }: TodayGoalProps) {
  const progress = Math.min((goalDone / goalTotal) * 100, 100);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🎯</span>
        <h2 className="text-[15px] font-extrabold text-gray-800">Today&apos;s Goal</h2>
      </div>

      <div className="flex items-center justify-between mb-2">
        <p className="text-[13px] font-semibold text-gray-600">{description}</p>
        <span className="text-[13px] font-extrabold text-indigo-600">
          {goalDone} / {goalTotal}
        </span>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Link
        href="/practice"
        id="continue-goal-btn"
        className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[13px] rounded-xl py-2.5 transition-colors shadow-sm"
      >
        Continue Goal
      </Link>
    </div>
  );
}
