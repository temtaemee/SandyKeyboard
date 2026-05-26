import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
`;

export const Title = styled.h1`
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.colors.textDark};
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 14px;
  margin-bottom: 40px;
`;

export const Tab = styled(NavLink)`
  padding: 12px 24px;
  border-radius: ${({ theme }) => theme.radius.full};
  text-decoration: none;
  background: ${({ theme }) => theme.colors.bgSection};
  color: ${({ theme }) => theme.colors.textMid};
  font-weight: 600;
  transition: all 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.accentBlue};
    color: ${({ theme }) => theme.colors.primary};
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

export const Content = styled.div``;
