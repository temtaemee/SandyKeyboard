import api from '../../../app/api/axios';

export const notificationApi = {
  getList:     ()        => api.get('/auth/notifications'),
  getUnreadCount: ()     => api.get('/auth/notifications/unread-count'),
  markRead:    (id)      => api.put('/auth/notifications', { id }),
  markAllRead: ()        => api.patch('/auth/notifications/read-all'),
};
