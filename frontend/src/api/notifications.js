import client from './client';

export const getMyNotifications = (page = 1, limit = 20) =>
  client.get('/notifications', { params: { page, limit } }).then((r) => r.data);

export const getUnreadCount = () =>
  client.get('/notifications/unread-count').then((r) => r.data);

export const markAllAsRead = () =>
  client.patch('/notifications/read-all').then((r) => r.data);

export const markAsRead = (notificationId) =>
  client.patch(`/notifications/${notificationId}/read`).then((r) => r.data);
