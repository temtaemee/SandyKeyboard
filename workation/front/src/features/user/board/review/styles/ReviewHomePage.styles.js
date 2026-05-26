import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  font-family: ${({ theme }) => theme.fonts.base};
  background: ${({ theme }) => theme.colors.bg};
  min-height: 100vh;
`;

export const Title = styled.h1`
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.colors.textDark};
`;

export const TabContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
`;

export const Tab = styled(NavLink)`
  padding: 10px 24px;
  border-radius: ${({ theme }) => theme.radius.full};
  text-decoration: none;
  background: ${({ theme }) => theme.colors.borderLight};
  color: ${({ theme }) => theme.colors.textMid};
  font-weight: 600;
  font-size: 14px;
  transition: all 0.15s;

  &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }

  &:hover:not(.active) {
    background: ${({ theme }) => theme.colors.border};
  }
`;

export const WriteButton = styled.button`
  padding: 10px 24px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textMid};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
