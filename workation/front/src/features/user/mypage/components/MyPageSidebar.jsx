import styled from 'styled-components';
import {
  User,
  ClipboardList,
  CreditCard,
  History,
  Settings,
  Headphones,
  Megaphone,
  LogOut,
  Store,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../../../app/api/axios';
import { useNavigate } from 'react-router-dom';
import useMypage from '../hooks/useMypage';

function MyPageSidebar({ memberInfo }) {
  const navi = useNavigate();

  const isSeller = memberInfo?.roleSet?.includes('SELLER');
  return (
    <Sidebar>
      <MenuSection>
        <MenuTitle>마이페이지</MenuTitle>

        <MenuItem active>
          <User size={18} />
          <span>내 프로필</span>
        </MenuItem>

        <MenuItem>
          <ClipboardList size={18} />
          <span>예약 현황</span>
        </MenuItem>

        <MenuItem>
          <CreditCard size={18} />
          <span>쿠폰</span>
        </MenuItem>

        <MenuItem>
          <History size={18} />
          <span>나의 활동</span>
        </MenuItem>

        <MenuItem>
          <Settings size={18} />
          <span>환경 설정</span>
        </MenuItem>
        {isSeller ? (
          <MenuItem
            onClick={() => {
              navi(`/seller`);
            }}
          >
            <span>판매자 센터</span>
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              navi(`/mypage/seller-apply`);
            }}
          >
            <span>판매자 신청</span>
          </MenuItem>
        )}
      </MenuSection>

      <BottomMenu>
        <BottomItem>
          <Headphones size={16} />
          <span>고객센터</span>
        </BottomItem>

        <BottomItem
          onClick={() => {
            navi(`/board/support/notice`);
          }}
        >
          <Megaphone size={16} />
          <span>공지사항</span>
        </BottomItem>

        <BottomItem
          onClick={() => {
            localStorage.removeItem('accessToken');
            window.location.replace('/');
          }}
        >
          <LogOut size={16} />
          <span>로그아웃</span>
        </BottomItem>
      </BottomMenu>
    </Sidebar>
  );
}

export default MyPageSidebar;

const Sidebar = styled.aside`
  width: 240px;
  min-width: 240px;
  flex-shrink: 0;

  background-color: white;
  border-right: 1px solid #edf1f4;
  padding: 40px 24px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const MenuSection = styled.div``;

const MenuTitle = styled.h2`
  font-size: 15px;
  color: #9ca3af;
  margin-bottom: 26px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 14px;
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 14px;

  color: ${({ active }) => (active ? '#3f6971' : '#6b7280')};

  background-color: ${({ active }) => (active ? '#eef5f6' : 'transparent')};

  font-weight: ${({ active }) => (active ? '600' : '400')};

  &:hover {
    background-color: #f3f6f8;
  }
`;

const BottomMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const BottomItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #9ca3af;
  font-size: 13px;
  cursor: pointer;
`;
