import api from '../../../app/api/axios';

/** 로그인 유저의 전체 알림 목록 조회 */
export async function getAdminNotifications() {
  const resp = await api.get('/auth/notifications');
  return resp.data;
}

/** 단일 알림 읽음 처리 (PUT) */
export async function readNotification(notificationId) {
  await api.put('/auth/notifications', { notificationId });
}

/** 모든 알림 일괄 읽음 처리 (PATCH) */
export async function readAllNotifications() {
  await api.patch('/auth/notifications/read-all');
}

/** 안 읽은 알림 개수 실시간 조회 */
export async function getUnreadCount() {
  const resp = await api.get('/auth/notifications/unread-count');
  return resp.data;
}
