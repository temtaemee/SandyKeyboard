import styled from 'styled-components';

/**
 * 관리자 공통 확인 모달 컴포넌트
 * 
 * @param {boolean} isOpen - 모달 오픈 여부
 * @param {function} onClose - 닫기 핸들러
 * @param {function} onConfirm - 확인 핸들러
 * @param {string} title - 제목
 * @param {string} description - 설명
 * @param {ReactNode} icon - 상단 아이콘 (선택)
 * @param {string} confirmText - 확인 버튼 텍스트
 * @param {string} cancelText - 취소 버튼 텍스트
 * @param {boolean} isDanger - 위험/삭제 작업 여부 (빨간색 버튼)
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  icon,
  confirmText = '확인',
  cancelText = '취소',
  isDanger = false,
}) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {icon && <IconWrapper $isDanger={isDanger}>{icon}</IconWrapper>}
        <ModalTitle>{title}</ModalTitle>
        <ModalDesc>{description}</ModalDesc>
        <ModalActions>
          <CancelBtn onClick={onClose}>{cancelText}</CancelBtn>
          <ConfirmBtn $isDanger={isDanger} onClick={onConfirm}>
            {confirmText}
          </ConfirmBtn>
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );
}

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px 28px 24px;
  width: 360px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  animation: modalSlideUp 0.3s ease-out;

  @keyframes modalSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const IconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ $isDanger }) => ($isDanger ? '#fff1f1' : '#f0fdf4')};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #0d1c2e;
`;

const ModalDesc = styled.p`
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  white-space: pre-line;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
  width: 100%;
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  background: white;
  font-family: inherit;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const ConfirmBtn = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: ${({ $isDanger }) => ($isDanger ? '#ef4444' : '#16a34a')};
  font-family: inherit;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;
