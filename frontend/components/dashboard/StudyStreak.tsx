'use client';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface StudyStreakProps {
  streakDays: number;
  streakWeek: boolean[]; // 7 booleans Mon-Sun
}

export default function StudyStreak({ streakDays, streakWeek }: StudyStreakProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <h2 className="text-[15px] font-extrabold text-gray-800">Study Streak</h2>
        </div>
        <span className="text-[14px] font-extrabold text-orange-500">{streakDays} Days</span>
      </div>

      <p className="text-[12px] text-gray-400 mb-3 font-medium">Awesome! Keep your streak going.</p>

      <div className="flex items-center gap-2 justify-between">
        {DAYS.map((day, i) => {
        const done = streakWeek[i] ?? false;
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-[11px] font-bold text-gray-400">{day}</span>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                done
                  ? 'bg-indigo-600'
                  : 'bg-gray-100 border-2 border-dashed border-gray-200'
              }`}
            >
              {done && (
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
