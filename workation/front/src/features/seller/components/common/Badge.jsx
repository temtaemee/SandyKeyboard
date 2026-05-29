import styled from 'styled-components';

/**
 * visibleYn 상태 배지
 * @param {string} visibleYn "Y" | "N"
 */
export default function Badge({ visibleYn }) {
  const isVisible = visibleYn === 'Y';
  return <BadgeEl $visible={isVisible}>{isVisible ? '노출 중' : '비노출'}</BadgeEl>;
}

const BadgeEl = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $visible }) => ($visible ? '#dcfce7' : '#ffedd5')};
  color: ${({ $visible }) => ($visible ? '#15803d' : '#c2410c')};
  white-space: nowrap;
`;
