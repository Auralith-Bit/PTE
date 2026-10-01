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

export interface OAuthProviders {
  providers: Record<string, string>;
}

export interface OAuthExchangeResult {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
  next: string;
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

export interface AnswerSubmission {
  question_id: number;
  answer: Record<string, unknown>;
}

export interface AnswerResult {
  score: number;
  max_score: number;
  feedback: string;
  correct: boolean;
  attempt_id: number;
}

export interface MockTest {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  kind: 'full_length' | 'section';
  category: string | null;
  duration_minutes: number;
  created_at: string;
}

export interface MockTestList {
  items: MockTest[];
  total: number;
}

export interface MockTestDetail {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  kind: 'full_length' | 'section';
  category: string | null;
  duration_minutes: number;
  total_questions: number;
  created_at: string;
}

export interface MockQuestion {
  id: number;
  category: string;
  type: string;
  title: string | null;
  instructions: string | null;
  content: Record<string, unknown>;
}

export interface MockAttemptStart {
  attempt_id: number;
  mock_test_id: number;
  name: string;
  duration_minutes: number;
  questions: MockQuestion[];
  started_at: string;
}

export interface MockPerQuestion {
  question_id: number;
  category: string;
  type: string;
  title: string | null;
  content: Record<string, unknown>;
  score: number;
  max_score: number;
  correct: boolean;
  feedback: string;
}

export interface MockAttemptResult {
  id: number;
  mock_test_id: number;
  test_name: string;
  status: string;
  total_score: number;
  max_score: number;
  per_question: MockPerQuestion[];
  started_at: string;
  completed_at: string | null;
}

export interface MockAttemptSummary {
  id: number;
  mock_test_id: number;
  status: string;
  test_name: string;
  kind: 'full_length' | 'section';
  category: string | null;
  duration_minutes: number;
  total_score: number | null;
  max_score: number | null;
  started_at: string;
  completed_at: string | null;
}

export interface MockAttemptList {
  items: MockAttemptSummary[];
  total: number;
}

export interface ActivityItem {
  title: string;
  status: 'completed' | 'in_progress' | 'not_started';
  time: string;
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  /** Null when the notification has no destination and must render as plain text. */
  href: string | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationList {
  items: Notification[];
  unread_count: number;
  total: number;
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

export type NotificationKind = 'practice_scored' | 'mock_graded';

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  created_at: string;
  read: boolean;
  href: string | null;
}

export interface NotificationList {
  items: NotificationItem[];
  unread_count: number;
}

