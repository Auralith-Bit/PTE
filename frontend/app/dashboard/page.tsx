'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { dashboardApi } from '@/lib/api/dashboard';
import type { DashboardSummary } from '@/types';

import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import StatsCards from '@/components/dashboard/StatsCards';
import PracticeSections from '@/components/dashboard/ProgressChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';
import OverallProgress from '@/components/dashboard/OverallProgress';
import TodayGoal from '@/components/dashboard/TodayGoal';
import StudyStreak from '@/components/dashboard/StudyStreak';
import RecentMockTest from '@/components/dashboard/RecentMockTest';
import UpcomingCourse from '@/components/dashboard/UpcomingCourse';

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

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const firstName = user?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there';

  // The only exact "has this user ever completed anything" signal.
  // progressPct rounds to 0 for people who have done some work, and
  // streakDays reads 0 for anyone who has not practiced today or
  // yesterday, so neither can be used to detect a brand-new account.
  const hasActivity = (summary?.questions_solved ?? 0) > 0;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    dashboardApi
      .getSummary()
      .then((data) => {
        if (!cancelled) {
          setSummary(data);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err?.message ?? 'Failed to load dashboard');
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="flex min-h-full w-full flex-col py-4 px-4 gap-[10px] lg:flex-row">
      {/* ── Main content (center) ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        {/* Welcome Banner */}
        <WelcomeBanner firstName={firstName} />

        {/* Stats Cards */}
        {loading ? (
          <div className="flex flex-col gap-4 sm:flex-row">
            <SkeletonCard className="flex-1" />
            <SkeletonCard className="flex-1" />
            <SkeletonCard className="flex-1" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm font-semibold">
            {error}
          </div>
        ) : summary ? (
          <StatsCards
            practiceCompletedPct={summary.practice_completed_pct}
            practiceWeeklyDelta={summary.practice_completed_weekly_delta}
            questionsSolved={summary.questions_solved}
            questionsWeeklyDelta={summary.questions_solved_weekly_delta}
            mockTestsTaken={summary.mock_tests_taken}
            mockTestsWeeklyDelta={summary.mock_tests_weekly_delta}
            hasActivity={hasActivity}
          />
        ) : null}

        {/* Practice by Section */}
        {loading ? (
          <SkeletonCard className="h-64" />
        ) : summary ? (
          <PracticeSections
            speakingPct={summary.speaking_pct}
            writingPct={summary.writing_pct}
            readingPct={summary.reading_pct}
            listeningPct={summary.listening_pct}
          />
        ) : null}

        {/* Recent Activity */}
        {loading ? (
          <SkeletonCard className="h-52" />
        ) : summary ? (
          <RecentActivity activities={summary.recent_activity} />
        ) : null}

        {/* Quick Actions */}
        <QuickActions />
      </div>

      {/* ── Right Panel ── */}
      <aside className="w-full shrink-0 p-4 pt-6 flex flex-col gap-4 lg:w-[clamp(250px,27vw,530px)]">
        {loading ? (
          <>
            <SkeletonCard className="h-48" />
            <SkeletonCard className="h-36" />
            <SkeletonCard className="h-36" />
            <SkeletonCard className="h-40" />
            <SkeletonCard className="h-40" />
          </>
        ) : summary ? (
          <>
            <OverallProgress
              progressPct={summary.overall_progress_pct}
              targetScore={summary.target_score}
              hasActivity={hasActivity}
            />
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
            <RecentMockTest
              name={summary.recent_mock_name}
              score={summary.recent_mock_score}
              completedLabel={summary.recent_mock_completed_label}
            />
            <UpcomingCourse
              courseName={summary.upcoming_course_name}
              progressPct={summary.upcoming_course_progress_pct}
            />
          </>
        ) : null}
      </aside>
    </div>
  );
}
