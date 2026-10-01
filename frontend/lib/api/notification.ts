import { api } from './client';
import type { NotificationList } from '@/types';

export const notificationApi = {
  list: () => api.get<NotificationList>('/notifications'),
  markAllRead: () => api.post<NotificationList>('/notifications/read'),
};
