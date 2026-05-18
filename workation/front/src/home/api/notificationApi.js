import api from "../../app/api/axios";

// 알림 전체 조회
export const getNotificationList = async () => {
    const resp = await api.get('/auth/notifications');
    return resp.data;
};

// 안읽은 알림 개수 조회
export const getUnreadCount = async () => {
    const resp = await api.get('/auth/notifications/unread-count');
    return resp.data;
};

// 단일 알림 읽음 처리
export const readNotification = async (notificationId) => {
    const resp = await api.put('/auth/notifications', {
        notificationId,
    });

    return resp.data;
};

// 전체 읽음 처리
export const readAllNotification = async () => {
    const resp = await api.patch('/auth/notifications/read-all');
    return resp.data;
};

// 테스트용 알림 생성
export const createTestNotification = async () => {
    const resp = await api.post('/auth/notifications');
    return resp.data;
};