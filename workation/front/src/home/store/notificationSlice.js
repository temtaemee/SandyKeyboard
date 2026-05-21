import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notificationList: [],
    unreadCount: 0,
    stompClient: null, // 웹소켓 연결 객체를 전역으로 관리합니다.
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        // 1. 기존 알림 목록을 한 번에 세팅 (초기 API 조회용)
        setNotifications: (state, action) => {
            state.notificationList = action.payload;
        },
        // 2. 안읽은 알림 개수 세팅
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },
        // 3. 실시간으로 새 알림이 도착했을 때 리스트 맨 앞에 추가
        addNotification: (state, action) => {
            state.notificationList.unshift(action.payload); // 맨 앞에 추가
            state.unreadCount += 1; // 안읽은 개수 누적
        },
        // 4. 소켓 클라이언트 객체 저장 및 해제
        setStompClient: (state, action) => {
            state.stompClient = action.payload;
        },
    },
});

// 컴포넌트나 훅에서 사용할 액션 함수들 내보내기
export const {
    setNotifications,
    setUnreadCount,
    addNotification,
    setStompClient
} = notificationSlice.actions;

export default notificationSlice.reducer;