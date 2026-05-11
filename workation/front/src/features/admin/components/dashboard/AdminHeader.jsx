// src/features/admin/components/dashboard/AdminHeader.jsx
import { useState } from 'react';
import styled from 'styled-components';

export default function AdminHeader() {
  const [search, setSearch] = useState('');

  return (
    <Header>
      {/* 검색 */}
      <SearchWrap>
        <SearchIconWrap>
          <SearchSvg />
        </SearchIconWrap>
        <SearchInput
          placeholder="분석 검색 또는 예약 관리..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchWrap>

      {/* 우측 */}
      <Right>
        <IconBtn aria-label="알림" $hasAlert>
          <BellIcon />
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
    </Header>
  );
}

/* ── Icons ── */
function SearchSvg() {
  return (
    <svg
      width="13.5"
      height="13.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6b7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#475569"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg
      width="20.1"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#475569"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
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
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
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
  background: #f8fafc;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  color: #0d1c2e;
  font-family: inherit;
  outline: none;

  &::placeholder {
    color: #6b7280;
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
    background: #f1f5f9;
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
  background: #e2e8f0;
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
  color: #0d1c2e;
  line-height: 1.4;
`;

const AdminRole = styled.p`
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.5;
`;

const AdminAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #244c54;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: white;
  cursor: pointer;
`;
