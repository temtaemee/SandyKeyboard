// src/features/seller/components/dashboard/DashboardHeader.jsx
import { useState } from 'react';
import styled from 'styled-components';

export default function DashboardHeader() {
  const [search, setSearch] = useState('');

  return (
    <Header>
      <Title>모래묻은 키보드 판매자 센터</Title>
      <Right>
        <SearchBox>
          <SearchIcon />
          <SearchInput
            placeholder="통계 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchBox>
        <IconBtn aria-label="알림">
          <BellIcon />
        </IconBtn>
        <IconBtn aria-label="도움말">
          <HelpIcon />
        </IconBtn>
        <Avatar>판</Avatar>
      </Right>
    </Header>
  );
}

/* ── Icons ── */
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function HelpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/* ── Styled Components ── */

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  height: 64px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #f1f5f9;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 500;
  color: #3d646c;
  letter-spacing: -0.5px;
  white-space: nowrap;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  width: 200px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  background: none;
  font-size: 14px;
  color: #6b7280;
  width: 100%;
  font-family: inherit;

  &::placeholder {
    color: #9ca3af;
  }
`;

const IconBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover {
    background: #f1f5f9;
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9999px;
  border: 2px solid #3d646c;
  background: #3d646c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: white;
  cursor: pointer;
`;
