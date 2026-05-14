// src/features/admin/components/dashboard/AdminHeader.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { Search, Bell, X, Settings } from 'lucide-react';

import { NOTIFICATIONS } from '../../data/adminDashboardData';
import { NOTIF_TYPE_COLOR } from '../../data/adminDashboardConstants';

export default function AdminHeader() {
  const [search, setSearch] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const unreadCount = notifs.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <Header>
      {/* 검색 */}
      <SearchWrap>
        <SearchIconWrap>
          <Search size={13.5} color="#6b7280" />
        </SearchIconWrap>
        <SearchInput
          placeholder="분석 검색 또는 예약 관리..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchWrap>

      {/* 우측 */}
      <Right>
        <IconBtn aria-label="알림" $hasAlert={unreadCount > 0} onClick={() => setNotifOpen(true)}>
          <Bell size={18} color="#475569" />
        </IconBtn>

        <VertDivider />
        <AdminInfo>
          <InfoText>
            <AdminName>관리자 계정</AdminName>
            <AdminRole>시스템 관리자</AdminRole>
          </InfoText>
          <AdminAvatar>관</AdminAvatar>
        </AdminInfo>
      </Right>

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
                  onClick={() => setNotifs((prev) =>
                    prev.map((item) => item.id === n.id ? { ...item, unread: false } : item)
                  )}
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
    </Header>
  );
}

/* ── Styled Components ── */

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  height: 64px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
`;

const SearchWrap = styled.div`
  position: relative;
  width: 384px;
`;

const SearchIconWrap = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 16px 8px 40px;
  background: ${({ theme }) => theme.colors.bgSection};
  border: none;
  border-radius: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: inherit;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconBtn = styled.button`
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.borderLight};
  }

  ${({ $hasAlert }) =>
    $hasAlert &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 8px; right: 8px;
      width: 8px; height: 8px;
      background: #ba1a1a;
      border-radius: 50%;
    }
  `}
`;

const VertDivider = styled.div`
  width: 1px;
  height: 32px;
  background: ${({ theme }) => theme.colors.border};
  margin: 0 12px;
`;

const AdminInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const AdminName = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
  line-height: 1.4;
`;

const AdminRole = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.5;
`;

/* ── 알림 모달 ── */


const NotifOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 200;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding-top: 72px;
  padding-right: 16px;
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
  max-height: calc(100vh - 96px);
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
  &:hover { background: rgba(36,76,84,0.06); }
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
  &:hover { background: ${({ theme }) => theme.colors.borderLight}; }
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
  background: ${({ $unread }) => ($unread ? 'rgba(36,76,84,0.03)' : 'transparent')};
  cursor: pointer;
  transition: background 0.1s;
  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.bgSection}; }
`;

const NotifDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
  background: ${({ $type, $show }) => ($show ? NOTIF_TYPE_COLOR[$type] ?? '#3b82f6' : 'transparent')};
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
  &:hover { background: ${({ theme }) => theme.colors.bgSection}; }
`;

const AdminAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.adminPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
`;
