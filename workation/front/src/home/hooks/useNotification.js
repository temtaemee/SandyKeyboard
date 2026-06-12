import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs'; // STOMP 라이브러리 임포트
import {
    getNotificationList,
    getUnreadCount,
    readNotification,
    readAllNotification,
} from '../api/notificationApi';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification, setNotifications, setStompClient, setUnreadCount } from '../store/notificationSlice';
import { WS_URL } from '../../app/config/env';


export const useNotification = () => {
    const stompClientRef = useRef(null); // 소켓 클라이언트 객체를 유지할 ref
    const dispatch = useDispatch();
    const { notificationList, unreadCount } = useSelector(
        (state) => state.notification
    );
    const token = localStorage.getItem("accessToken");
    let memberId = null;
    if (token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            // 백엔드 토큰 페이로드에 담긴 Key 이름을 적어줍니다 (예: id 혹은 memberId)
            memberId = JSON.parse(jsonPayload).memberId;
        } catch (error) {
            console.error("토큰 파싱 에러:", error);
        }
    }

    // 기존 알림 전체 및 개수 조회 (초기 로드용)
    const fetchNotifications = async () => {
        const data = await getNotificationList();
        dispatch(setNotifications(data));
    };

    const fetchUnreadCount = async () => {
        const count = await getUnreadCount();
        dispatch(setUnreadCount(count));
    };

    const handleReadNotification = async (notificationId) => {
        await readNotification(notificationId);
        await fetchNotifications();
        await fetchUnreadCount();
    };

    const handleReadAllNotification = async () => {
        await readAllNotification();
        await fetchNotifications();
        await fetchUnreadCount();
    };

    // 웹소켓 연결 및 구독 설정
    useEffect(() => {
        if (!memberId) return;
        fetchNotifications();
        fetchUnreadCount();


        // 2. STOMP 클라이언트 생성
        const client = new Client({
            brokerURL: WS_URL,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('리덕스 웹소켓 연결 성공!');

                client.subscribe(`/topic/notifications/${memberId}`, (message) => {
                    if (message.body) {
                        const newNotification = JSON.parse(message.body);
                        console.log('실시간 알림 도착: ', newNotification);
                        dispatch(addNotification(newNotification));
                    }
                });
            },
            onStompError: (frame) => {
                console.error('STOMP 에러: ' + frame);
            },
        });

        // 소켓 활성화 (연결 시작)
        stompClientRef.current = client;
        client.activate();
        dispatch(setStompClient(client));

        return () => {
            client.deactivate();
            stompClientRef.current = null;
            dispatch(setStompClient(null));
        };
    }, [memberId, token, dispatch]);

    return {
        notificationList,
        unreadCount,
        fetchNotifications,
        handleReadNotification,
        handleReadAllNotification,
    };
};
