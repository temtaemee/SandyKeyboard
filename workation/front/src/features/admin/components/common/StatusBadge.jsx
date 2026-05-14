import styled from 'styled-components';

/**
 * 관리자 공통 상태 뱃지 컴포넌트
 * 
 * @param {string} children - 뱃지 텍스트
 * @param {string} $bg - 배경색
 * @param {string} $color - 글자색
 */
const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ $bg }) => $bg || '#f1f5f9'};
  color: ${({ $color }) => $color || '#64748b'};
  white-space: nowrap;
  text-align: center;
`;

export default StatusBadge;
