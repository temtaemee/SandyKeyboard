// src/features/admin/layouts/AdminDashboardLayout.jsx
import { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Bell, X } from 'lucide-react';

import {
  getAdminNotifications,
  readNotification,
  readAllNotifications,
} from '../api/adminNotificationApi';
import { NOTIF_TYPE_COLOR } from '../data/adminDashboardConstants';
import AdminSidebar from '../components/dashboard/AdminSidebar';
import AdminHeader from '../components/dashboard/AdminHeader';

// 알림이 생성된 시각을 현재 기준으로 상대적 텍스트("방금 전", "N분 전", "N시간 전")로 변환하는 헬퍼 함수
const formatTime = (createdAtStr) => {
  if (!createdAtStr) return '방금 전';
  try {
    const now = new Date();
    const created = new Date(createdAtStr);
    const diffMs = now - created;
    if (isNaN(diffMs) || diffMs < 0) return '방금 전';

    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;

    return createdAtStr.split('T')[0].replace(/-/g, '.');
  } catch (e) {
    return '방금 전';
  }
};

// 백엔드 알림 DTO 규격을 프론트엔드가 요구하는 알림 카드로 매핑하는 변환 함수
const mapBackendNotificationToFrontend = (item) => {
  const mapType = (backendType) => {
    switch (backendType) {
      case 'RESERVATION_COMPLETE':
      case 'PAYMENT_COMPLETE':
        return 'success';
      case 'RESERVATION_CANCELLED':
      case 'SYSTEM_ALERT':
        return 'warning';
      default:
        return 'info';
    }
  };

  return {
    id: item.id,
    type: mapType(item.type),
    title: item.typeDescription || '새로운 알림',
    desc: item.content,
    time: formatTime(item.createdAt),
    unread: !item.read, // 백엔드 read 여부를 unread로 반전 매핑
    redirectUrl: item.redirectUrl,
  };
};

/**
 * 관리자 대시보드 전용 레이아웃
 *
 * 공통 Header/Footer(Layout.jsx) 대신 사이드바 + 자체 헤더를 사용합니다.
 * AdminRouter.jsx에서 이 레이아웃을 부모 라우트로 설정하면
 * 자식 라우트들이 <Outlet /> 자리에 렌더링됩니다.
 */
export default function AdminDashboardLayout() {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);

  //에러 발생 시 자동 로그아웃 + 관리자 로그인 페이지로 이동
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      alert('로그인이 필요한 페이지입니다.');
      navigate('/login');
      return;
    }
    try {
      // 토큰 디코딩하여 ADMIN 권한 확인
      const payload = JSON.parse(atob(token.split('.')[1]));
      const roles = payload.roles || [];

      if (!roles.includes('ADMIN')) {
        alert('관리자만 접근할 수 있습니다.');
        navigate('/login');
      }
    } catch (e) {
      // 잘못된 형식의 토큰인 경우
      localStorage.removeItem('accessToken');
      alert('올바르지 않은 토큰 세션입니다. 다시 로그인해주세요.');
      navigate('/login');
    }
  }, [navigate]);

  const unreadCount = notifs.filter((n) => n.unread).length;

  // 알림 데이터 실시간 조회 함수
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getAdminNotifications();
      const mapped = (data || []).map(mapBackendNotificationToFrontend);
      setNotifs(mapped);
    } catch (err) {
      console.error('알림 목록 fetch 에러:', err);
    }
  }, []);

  // 마운트 시 알림 조회 및 주기적 풀링(Optional, 30초마다 갱신)
  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 30000); // 30초 풀링
    return () => clearInterval(timer);
  }, [fetchNotifications]);

  // 알림 전체 읽음 처리
  const handleMarkAllRead = async () => {
    try {
      await readAllNotifications();
      setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch (err) {
      console.error(err);
    }
  };

  // 개별 알림 클릭 시 읽음 처리
  const handleNotifClick = async (n) => {
    if (n.unread) {
      try {
        await readNotification(n.id);
        setNotifs((prev) =>
          prev.map((item) =>
            item.id === n.id ? { ...item, unread: false } : item
          )
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <Wrapper>
      <AdminSidebar />
      <ContentArea>
        <AdminHeader />
        <Main>
          <Outlet />
        </Main>
      </ContentArea>

      {/* 알림 FAB 버튼 */}
      <Fab title="알림" onClick={() => setNotifOpen(!notifOpen)}>
        <Bell size={24} color="white" />
        {unreadCount > 0 && <FabBadge>{unreadCount}</FabBadge>}
      </Fab>

      {/* 알림 모달 */}
      {notifOpen && (
        <NotifOverlay onClick={() => setNotifOpen(false)}>
          <NotifModal onClick={(e) => e.stopPropagation()}>
            <NotifModalHeader>
              <NotifModalTitleRow>
                <NotifModalTitle>알림</NotifModalTitle>
                {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
              </NotifModalTitleRow>
              <NotifHeaderActions>
                {unreadCount > 0 && (
                  <MarkAllBtn onClick={handleMarkAllRead}>모두 읽음</MarkAllBtn>
                )}
                <CloseBtn onClick={() => setNotifOpen(false)}>
                  <X size={16} />
                </CloseBtn>
              </NotifHeaderActions>
            </NotifModalHeader>

            <NotifList>
              {notifs.length === 0 ? (
                <EmptyNotifs>수신된 알림이 없습니다.</EmptyNotifs>
              ) : (
                notifs.map((n) => (
                  <NotifItem
                    key={n.id}
                    $unread={n.unread}
                    onClick={() => handleNotifClick(n)}
                  >
                    <NotifDot $type={n.type} $show={n.unread} />
                    <NotifContent>
                      <NotifTitle $unread={n.unread}>{n.title}</NotifTitle>
                      <NotifDesc>{n.desc}</NotifDesc>
                      <NotifTime>{n.time}</NotifTime>
                    </NotifContent>
                  </NotifItem>
                ))
              )}
            </NotifList>
          </NotifModal>
        </NotifOverlay>
      )}
    </Wrapper>
  );
}

/* ── Styled Components ── */

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bgSection};
`;

const ContentArea = styled.div`
  flex: 1;
  margin-left: 256px;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  padding: 64px 32px 71.5px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1440px;
  width: 100%;
`;

const Fab = styled.button`
  position: fixed;
  bottom: 31.5px;
  right: 32px;
  width: 56px;
  height: 56px;
  background: ${({ theme }) => theme.colors.adminPrimary};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  transition:
    background 0.2s,
    transform 0.1s;
  z-index: 40;

  &:hover {
    background: ${({ theme }) => theme.colors.adminPrimaryLight};
    transform: translateY(-2px);
  }
`;

const FabBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ba1a1a;
  color: white;
  font-size: 11px;
  font-weight: 700;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.colors.bgSection};
`;

/* ── 알림 모달 ── */

const NotifOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding-bottom: 96px;
  padding-right: 32px;
`;

const NotifModal = styled.div`
  width: 380px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: calc(100vh - 120px);
`;

const NotifModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const NotifModalTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NotifModalTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const UnreadBadge = styled.span`
  background: ${({ theme }) => theme.colors.adminPrimary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
`;

const NotifHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MarkAllBtn = styled.button`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminPrimary};
  padding: 4px 8px;
  border-radius: 4px;
  font-family: inherit;
  transition: background 0.15s;
  &:hover {
    background: rgba(36, 76, 84, 0.06);
  }
`;

const CloseBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.borderLight};
  }
`;

const NotifList = styled.div`
  overflow-y: auto;
  flex: 1;
`;

const NotifItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  background: ${({ $unread }) =>
    $unread ? 'rgba(36,76,84,0.03)' : 'transparent'};
  cursor: pointer;
  transition: background 0.1s;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;

const NotifDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
  background: ${({ $type, $show }) =>
    $show ? (NOTIF_TYPE_COLOR[$type] ?? '#3b82f6') : 'transparent'};
  border: ${({ $show }) => ($show ? 'none' : '1.5px solid #e2e8f0')};
`;

const NotifContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
`;

const NotifTitle = styled.p`
  font-size: 13px;
  font-weight: ${({ $unread }) => ($unread ? '600' : '500')};
  color: ${({ theme }) => theme.colors.adminTextDark};
  line-height: 1.4;
`;

const NotifDesc = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;

const NotifTime = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 2px;
`;

const EmptyNotifs = styled.div`
  padding: 40px 20px;
  text-align: center;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;
