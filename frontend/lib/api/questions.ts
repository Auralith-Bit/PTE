import { api } from './client';
import type { Question, QuestionList } from '@/types';

export type QuestionCategory = 'speaking' | 'writing' | 'reading' | 'listening';

export interface ListQuestionsOptions {
  type?: string;
  difficulty?: string;
  limit?: number;
  offset?: number;
  random?: boolean;
}

function buildQuery(params: ListQuestionsOptions): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export const questionsApi = {
  list: (category: QuestionCategory, options: ListQuestionsOptions = {}) =>
    api.get<QuestionList>(`/${category}/questions${buildQuery(options)}`),
  get: (category: QuestionCategory, questionId: number) =>
    api.get<Question>(`/${category}/questions/${questionId}`),
};
