import { useEffect, useState } from 'react';
import {
    getNotificationList,
    getUnreadCount,
    readNotification,
    readAllNotification,
} from '../api/notificationApi';

export const useNotification = () => {
    const [notificationList, setNotificationList] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        const data = await getNotificationList();
        setNotificationList(data);
    };

    const fetchUnreadCount = async () => {
        const count = await getUnreadCount();
        setUnreadCount(count);
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

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
        const interval = setInterval(() => {
            fetchUnreadCount();
            fetchNotifications();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return {
        notificationList,
        unreadCount,
        fetchNotifications,
        handleReadNotification,
        handleReadAllNotification,
    };
};