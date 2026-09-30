'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  weeklyDelta: number;
  hasActivity: boolean;
  unit?: string;
  progress?: number;
}

function DeltaBadge({ delta }: { delta: number }) {
  const direction = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const tone =
    direction === 'up' ? 'text-green-500' : direction === 'down' ? 'text-red-500' : 'text-gray-400';
  const path = {
    up: 'M5 10l7-7m0 0l7 7m-7-7v18',
    down: 'M5 14l7 7m0 0l7-7m-7 7V3',
    flat: 'M5 12h14',
  }[direction];

  return (
    <div className="flex items-center gap-1 mt-1">
      <svg className={`w-3 h-3 ${tone}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={path} />
      </svg>
      <span className={`text-[12px] font-semibold ${tone}`}>
        {direction === 'flat' ? 'No change this week' : `${delta > 0 ? '+' : ''}${delta}% this week`}
      </span>
    </div>
  );
}

function StatCard({ label, value, weeklyDelta, hasActivity, unit = '', progress }: StatCardProps) {
  return (
    <div className="rounded-2xl p-5 flex items-start gap-4 shadow-sm border border-[#D9D9D9] flex-1 min-w-0 hover:shadow-md transition-shadow" style={{ backgroundColor: '#F6F6F6' }}>
      {/* Icon box */}
      <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-semibold text-gray-400 mb-0.5 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-extrabold text-gray-800 leading-tight">
          {value}{unit}
        </p>
        {hasActivity && <DeltaBadge delta={weeklyDelta} />}
        {progress !== undefined && (
          <div className="mt-2.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface StatsCardsProps {
  practiceCompletedPct: number;
  practiceWeeklyDelta: number;
  questionsSolved: number;
  questionsWeeklyDelta: number;
  mockTestsTaken: number;
  mockTestsWeeklyDelta: number;
  hasActivity: boolean;
}

export default function StatsCards({
  practiceCompletedPct,
  practiceWeeklyDelta,
  questionsSolved,
  questionsWeeklyDelta,
  mockTestsTaken,
  mockTestsWeeklyDelta,
  hasActivity,
}: StatsCardsProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <StatCard
        label="Practice Completed"
        value={practiceCompletedPct}
        unit="%"
        weeklyDelta={practiceWeeklyDelta}
        progress={practiceCompletedPct}
        hasActivity={hasActivity}
      />
      <StatCard
        label="Questions Solved"
        value={questionsSolved.toLocaleString()}
        weeklyDelta={questionsWeeklyDelta}
        hasActivity={hasActivity}
      />
      <StatCard
        label="Mock Tests Taken"
        value={mockTestsTaken}
        weeklyDelta={mockTestsWeeklyDelta}
        progress={mockTestsTaken * 5}
        hasActivity={hasActivity}
      />
    </div>
  );
}
