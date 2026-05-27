import styled from 'styled-components';

export const Wrapper = styled.div``;

export const TopRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

export const WriteButton = styled.button`
  padding: 9px 22px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

export const Board = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.textDark};
`;

export const HeaderRow = styled.div`
  display: flex;
  padding: 14px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
  font-weight: 600;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 22px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: background 0.12s;
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;

export const PinnedRow = styled(Row)`
  background: ${({ theme }) => theme.colors.bgSection};
`;

export const TitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PinnedTitle = styled.span`
  font-weight: 600;
`;

export const NoticeBadge = styled.span`
  padding: 3px 8px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 12px;
  white-space: nowrap;
`;

export const ColNum = styled.div`
  width: 60px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
`;

export const ColTitle = styled.div`
  flex: 1;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textDark};
`;

export const ColDate = styled.div`
  width: 100px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
  text-align: right;
`;

export const Empty = styled.div`
  padding: 48px 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 15px;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 32px;
`;

export const PageBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.white};
  color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.textMid)};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '700' : '400')};
  cursor: pointer;
  &:disabled {
    opacity: 0.3;
  }
`;
