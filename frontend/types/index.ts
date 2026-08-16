export interface User {
  id: number;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface UserRegister {
  email: string;
  password: string;
  full_name?: string | null;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface Question {
  id: number;
  category: string;
  type: string;
  title: string | null;
  instructions: string | null;
  difficulty: string;
  content: Record<string, unknown>;
  created_at: string;
}

export interface QuestionList {
  items: Question[];
  total: number;
}

export interface ActivityItem {
  title: string;
  status: 'completed' | 'in_progress' | 'not_started';
  time: string;
}

export interface DashboardSummary {
  practice_completed_pct: number;
  practice_completed_weekly_delta: number;
  questions_solved: number;
  questions_solved_weekly_delta: number;
  mock_tests_taken: number;
  mock_tests_weekly_delta: number;
  overall_progress_pct: number;
  target_score: number;
  goal_description: string;
  goal_total: number;
  goal_done: number;
  streak_days: number;
  streak_week: boolean[];
  speaking_pct: number;
  writing_pct: number;
  reading_pct: number;
  listening_pct: number;
  recent_mock_name: string;
  recent_mock_score: number;
  recent_mock_completed_label: string;
  upcoming_course_name: string;
  upcoming_course_progress_pct: number;
  recent_activity: ActivityItem[];
}

