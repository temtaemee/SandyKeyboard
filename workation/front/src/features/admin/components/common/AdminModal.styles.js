// src/features/admin/components/common/AdminModal.styles.js
//
// 4개 페이지(Reservation, Sellers, Spaces, Board)에서 반복되던
// Modal styled-components를 하나로 통합.
//
// ─ 공통 export ────────────────────────────────────────────
//   ModalOverlay  : 배경 딤 + 센터 정렬 (전 페이지 동일)
//   ModalContent  : 흰 카드 컨테이너. $width prop으로 너비 조절 (기본 480px)
//   ModalCloseBtn : 우상단 닫기 X 버튼 (전 페이지 동일)
//   ModalHeader   : 제목 영역 구분선. $align(기본 'center'), $gap(기본 0) 으로 조절
//
// ─ 각 페이지별 특이 스타일은 해당 파일에 local 선언으로 유지 ──
//   ex) ModalBody, ModalFooter, ModalTitle 은 페이지마다 padding/flex 다름

import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// $width: 모달 가로 크기 (Reservation=480, Spaces=500, Sellers/Board=520)
export const ModalContent = styled.div`
  background: white;
  width: ${({ $width }) => $width ?? '480px'};
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: ${({ $maxHeight }) => $maxHeight ?? 'none'};
`;

// $align: 'center'(기본) | 'flex-start' (고객·게시판 모달처럼 제목이 여러 줄일 때)
// $gap  : 헤더 내부 아이템 간격 (기본 0)
export const ModalHeader = styled.div`
  display: flex;
  align-items: ${({ $align }) => $align ?? 'center'};
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  gap: ${({ $gap }) => $gap ?? '0'};
`;

export const ModalCloseBtn = styled.button`
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: color 0.15s;
  &:hover {
    color: #475569;
  }
`;
