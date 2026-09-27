import { api } from './client';
import type {
  MockAttemptList,
  MockAttemptResult,
  MockAttemptStart,
  MockTestDetail,
  MockTestList,
} from '@/types';

export const mockTestApi = {
  list: (section?: 'full_length' | 'section') =>
    api.get<MockTestList>(
      `/mock-tests${section ? `?section=${section}` : ''}`,
    ),
  detail: (testId: number) => api.get<MockTestDetail>(`/mock-tests/${testId}`),
  start: (testId: number) => api.post<MockAttemptStart>(`/mock-tests/${testId}/start`),
  submit: (attemptId: number, answers: Record<string, Record<string, unknown>>) =>
    api.post<MockAttemptResult>(`/mock-tests/attempts/${attemptId}/submit`, { answers }),
  attempts: (limit = 20, offset = 0) =>
    api.get<MockAttemptList>(`/mock-tests/attempts?limit=${limit}&offset=${offset}`),
  result: (attemptId: number) =>
    api.get<MockAttemptResult>(`/mock-tests/attempts/${attemptId}`),
};
