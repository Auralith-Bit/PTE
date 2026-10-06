'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { errorMessage } from '@/lib/api/client';
import { dashboardApi } from '@/lib/api/dashboard';
import type { DashboardSummary } from '@/types';

import OverallProgress from '@/components/dashboard/OverallProgress';
import PracticeSections from '@/components/dashboard/ProgressChart';
import StatsCards from '@/components/dashboard/StatsCards';
import StudyStreak from '@/components/dashboard/StudyStreak';
import TodayGoal from '@/components/dashboard/TodayGoal';

const Chevron = () => <span className="chevron" aria-hidden="true">›</span>;

function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl animate-pulse shadow-sm ${className}`}>
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="h-8 bg-gray-100 rounded w-3/4" />
        <div className="h-2 bg-gray-100 rounded w-full" />
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    dashboardApi
      .getSummary()
      .then((data) => {
        if (!cancelled) {
          setSummary(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(errorMessage(err));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  const hasActivity = (summary?.questions_solved ?? 0) > 0;

  return (
    <div className="min-h-screen bg-white font-sans">
      <section className="bg-[#F5F3FF]">
        <div className="page-container">
          <div className="breadcrumbs max-w-2xl pt-7">
            <Link href="/dashboard">Dashboard</Link>
            <Chevron />
            <span>Progress</span>
          </div>
          <div className="pb-9 pt-6">
            <h1 className="text-[33px] font-extrabold text-black leading-[1.15] tracking-tight">
              Progress &amp; Analytics
            </h1>
            <p className="text-black text-[15px] mt-3 max-w-2xl leading-relaxed font-medium">
              Detailed analytics and skill breakdown. Track how each section is improving and where
              to focus your next practice session.
            </p>
          </div>
        </div>
      </section>

      <div className="page-container py-8 flex flex-col gap-5">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-red-600 text-sm font-semibold">{error}</p>
            <button
              type="button"
              onClick={() => setNonce((n) => n + 1)}
              className="self-start sm:self-auto bg-red-600 hover:bg-red-700 text-white font-bold text-[13px] rounded-xl px-5 py-2 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <>
            <div className="flex flex-col gap-4 sm:flex-row">
              <SkeletonCard className="flex-1" />
              <SkeletonCard className="flex-1" />
              <SkeletonCard className="flex-1" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <SkeletonCard className="h-48 lg:col-span-1" />
              <SkeletonCard className="h-48 lg:col-span-2" />
            </div>
            <SkeletonCard className="h-64" />
          </>
        ) : summary ? (
          <>
            <StatsCards
              practiceCompletedPct={summary.practice_completed_pct}
              practiceWeeklyDelta={summary.practice_completed_weekly_delta}
              questionsSolved={summary.questions_solved}
              questionsWeeklyDelta={summary.questions_solved_weekly_delta}
              mockTestsTaken={summary.mock_tests_taken}
              mockTestsWeeklyDelta={summary.mock_tests_weekly_delta}
              hasActivity={hasActivity}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <OverallProgress
                progressPct={summary.overall_progress_pct}
                targetScore={summary.target_score}
                hasActivity={hasActivity}
              />
              <div className="lg:col-span-2 flex flex-col gap-5">
                <TodayGoal
                  description={summary.goal_description}
                  goalDone={summary.goal_done}
                  goalTotal={summary.goal_total}
                />
                <StudyStreak
                  streakDays={summary.streak_days}
                  streakWeek={summary.streak_week}
                  hasActivity={hasActivity}
                />
              </div>
            </div>

            <PracticeSections
              speakingPct={summary.speaking_pct}
              writingPct={summary.writing_pct}
              readingPct={summary.reading_pct}
              listeningPct={summary.listening_pct}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
