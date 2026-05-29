// src/features/seller/layouts/SellerDefaltLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Bell, X } from 'lucide-react';

import useAuth from '../../member/hooks/useAuth';
import {
  SELLER_NOTIFICATIONS,
  SELLER_NOTIF_TYPE_COLOR,
} from '../data/sellerConstants';
import SellerSidebar from '../components/SellerSidebar';
import SellerHeader from '../components/SellerHeader';

export default function SellerDefaltLayout() {
  const navigate = useNavigate();
  const { isLoggedIn, isSeller, loading: authLoading } = useAuth();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(SELLER_NOTIFICATIONS);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn || !isSeller) {
      navigate('/home', { replace: true });
    }
  }, [authLoading, isLoggedIn, isSeller, navigate]);

  if (authLoading) return <AuthScreen>로딩 중...</AuthScreen>;
  if (!isLoggedIn || !isSeller) return null;

  const unreadCount = notifs.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <Wrapper>
      <SellerSidebar />
      <ContentArea>
        <SellerHeader />
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
              {notifs.map((n) => (
                <NotifItem
                  key={n.id}
                  $unread={n.unread}
                  onClick={() =>
                    setNotifs((prev) =>
                      prev.map((item) =>
                        item.id === n.id ? { ...item, unread: false } : item
                      )
                    )
                  }
                >
                  <NotifDot $type={n.type} $show={n.unread} />
                  <NotifContent>
                    <NotifTitle $unread={n.unread}>{n.title}</NotifTitle>
                    <NotifDesc>{n.desc}</NotifDesc>
                    <NotifTime>{n.time}</NotifTime>
                  </NotifContent>
                </NotifItem>
              ))}
            </NotifList>

            <NotifModalFooter>
              <NotifFooterBtn onClick={() => setNotifOpen(false)}>
                전체 알림 보기
              </NotifFooterBtn>
            </NotifModalFooter>
          </NotifModal>
        </NotifOverlay>
      )}
    </Wrapper>
  );
}

/* ── Styled Components ── */

const SELLER_ACCENT = '#3ec9a7';

const AuthScreen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.bgSection};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

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
  background: ${SELLER_ACCENT};
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
    background: #31b08e;
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
  background: ${SELLER_ACCENT};
  color: white;
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
  color: ${SELLER_ACCENT};
  padding: 4px 8px;
  border-radius: 4px;
  font-family: inherit;
  transition: background 0.15s;
  &:hover {
    background: rgba(62, 201, 167, 0.08);
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
    $unread ? 'rgba(62,201,167,0.04)' : 'transparent'};
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
    $show ? (SELLER_NOTIF_TYPE_COLOR[$type] ?? '#3b82f6') : 'transparent'};
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

const NotifModalFooter = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding: 12px 20px;
  display: flex;
  justify-content: center;
`;

const NotifFooterBtn = styled.button`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMid};
  padding: 6px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-family: inherit;
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;
