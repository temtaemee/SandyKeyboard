// src/features/admin/components/common/Toggle.jsx
//
// 활성/정지 토글 스위치 공통 컴포넌트.
// SellersTable, CustomersTable, AdminSpacesPage 3곳에서 동일하게 쓰던 코드를 추출.
//
// Props
//   on        : boolean — true = 비활성(빨강), false = 활성(초록)
//   onClick   : 클릭 핸들러
//   onLabel   : $on=true 일 때 표시할 텍스트  (기본: '정지')
//   offLabel  : $on=false 일 때 표시할 텍스트 (기본: '활성')
//   labelWidth: ToggleLabel 의 min-width (기본: '24px') — 레이블이 길면 늘려서 사용

import styled from 'styled-components';

export default function Toggle({ on, onClick, onLabel = '정지', offLabel = '활성', labelWidth = '24px' }) {
  return (
    <ToggleRow onClick={onClick}>
      <ToggleTrack $on={on}>
        <ToggleThumb $on={on} />
      </ToggleTrack>
      <ToggleLabel $on={on} $minWidth={labelWidth}>
        {on ? onLabel : offLabel}
      </ToggleLabel>
    </ToggleRow>
  );
}

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
`;

const ToggleTrack = styled.div`
  width: 40px;
  height: 22px;
  border-radius: 999px;
  background: ${({ $on }) => ($on ? '#ef4444' : '#22c55e')};
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;
`;

const ToggleThumb = styled.div`
  position: absolute;
  top: 3px;
  left: ${({ $on }) => ($on ? '21px' : '3px')};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: left 0.2s;
`;

const ToggleLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ $on }) => ($on ? '#dc2626' : '#16a34a')};
  min-width: ${({ $minWidth }) => $minWidth};
`;
