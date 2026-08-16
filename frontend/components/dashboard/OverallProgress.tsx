'use client';

interface OverallProgressProps {
  progressPct: number;
  targetScore: number;
}

export default function OverallProgress({ progressPct, targetScore }: OverallProgressProps) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (progressPct / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h2 className="text-[16px] font-extrabold text-gray-800 mb-4">Overall Progress</h2>

      <div className="flex items-center gap-4">
        {/* Donut ring */}
        <div className="relative w-[120px] h-[120px] shrink-0">
          <svg className="w-[120px] h-[120px] -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={r} fill="none" stroke="#EEF0FF" strokeWidth="12" />
            <circle
              cx="60" cy="60" r={r}
              fill="none"
              stroke="#4F46E5"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[20px] font-extrabold text-gray-800">{progressPct}%</span>
            <span className="text-[11px] text-gray-400 font-semibold">Overall</span>
          </div>
        </div>

        {/* Target Score + Message */}
        <div className="flex flex-col gap-2">
          <div className="bg-indigo-50 rounded-xl px-4 py-2 text-center border border-indigo-100">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Target Score</p>
            <p className="text-[22px] font-extrabold text-indigo-600">{targetScore}+</p>
          </div>
          <p className="text-[12px] text-gray-500 leading-snug">
            You&apos;re doing great! Keep it up and achieve your target score.
          </p>
        </div>
      </div>
    </div>
  );
}
