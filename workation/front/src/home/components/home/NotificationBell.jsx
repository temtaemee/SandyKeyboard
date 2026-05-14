import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

function NotificationBell() {
  const dropdownRef = useRef();

  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: '예약이 확정되었습니다.',
      isRead: false,
    },
    {
      id: 2,
      message: '새로운 쿠폰이 발급되었습니다.',
      isRead: false,
    },
    {
      id: 3,
      message: '리뷰 작성 시 추가 혜택을 받을 수 있어요.',
      isRead: true,
    },
  ]);

  // 읽지 않은 알림 존재 여부
  const hasUnread = notifications.some((n) => !n.isRead);

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // 알림 클릭 시 읽음 처리
  const handleReadNotification = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  // 전체 읽음 처리
  const handleReadAll = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      }))
    );
  };

  return (
    <Wrapper ref={dropdownRef}>
      <BellButton
        onClick={() => setOpen((prev) => !prev)}
        $hasUnread={hasUnread}
      >
        <Bell size={20} />

        {hasUnread && <Badge />}
      </BellButton>

      {open && (
        <Dropdown>
          <DropdownHeader>
            <DropdownTitle>알림</DropdownTitle>

            {notifications.length > 0 && (
              <ReadAllButton onClick={handleReadAll}>모두 읽음</ReadAllButton>
            )}
          </DropdownHeader>

          <NotificationList>
            {notifications.length === 0 ? (
              <EmptyMessage>새로운 알림이 없습니다</EmptyMessage>
            ) : (
              notifications.map((item) => (
                <NotificationItem
                  key={item.id}
                  $isRead={item.isRead}
                  onClick={() => handleReadNotification(item.id)}
                >
                  {!item.isRead && <UnreadDot />}

                  <Message>{item.message}</Message>
                </NotificationItem>
              ))
            )}
          </NotificationList>
        </Dropdown>
      )}
    </Wrapper>
  );
}

export default NotificationBell;

/* ================= styled ================= */

const shake = keyframes`
  0% { transform: rotate(0deg); }
  20% { transform: rotate(-12deg); }
  40% { transform: rotate(12deg); }
  60% { transform: rotate(-8deg); }
  80% { transform: rotate(8deg); }
  100% { transform: rotate(0deg); }
`;

const Wrapper = styled.div`
  position: relative;
`;

const BellButton = styled.button`
  position: relative;

  width: 42px;
  height: 42px;

  border: none;
  border-radius: 50%;

  background-color: white;

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  color: #64748b;

  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f5f9;
  }

  svg {
    animation: ${({ $hasUnread }) => ($hasUnread ? shake : 'none')};

    animation-duration: 1s;
    animation-iteration-count: infinite;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;

  width: 8px;
  height: 8px;

  border-radius: 50%;
  background-color: #ef4444;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 52px;
  right: 0;

  width: 340px;

  background-color: white;

  border-radius: 22px;

  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);

  overflow: hidden;

  z-index: 999;
`;

const DropdownHeader = styled.div`
  height: 60px;

  padding: 0 18px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid #f1f5f9;
`;

const DropdownTitle = styled.h3`
  font-size: 16px;
  color: #374151;
`;

const ReadAllButton = styled.button`
  border: none;
  background: none;

  color: #3f6971;
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const NotificationList = styled.div`
  max-height: 360px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  position: relative;

  padding: 18px 18px 18px 24px;

  cursor: pointer;

  background-color: ${({ $isRead }) => ($isRead ? 'white' : '#f8fbfc')};

  transition: background-color 0.2s;

  &:hover {
    background-color: #f1f5f9;
  }
`;

const Message = styled.div`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
`;

const UnreadDot = styled.div`
  position: absolute;
  top: 24px;
  left: 12px;

  width: 7px;
  height: 7px;

  border-radius: 50%;
  background-color: #3f6971;
`;

const EmptyMessage = styled.div`
  padding: 60px 20px;

  text-align: center;

  color: #9ca3af;
  font-size: 14px;
`;
