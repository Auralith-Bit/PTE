import { api } from './client';
import type { Notification, NotificationList } from '@/types';

export const notificationsApi = {
  list: () => api.get<NotificationList>('/notifications'),
  markRead: (id: number) => api.post<Notification>(`/notifications/${id}/read`),
  markAllRead: () => api.post<NotificationList>('/notifications/read-all'),
};