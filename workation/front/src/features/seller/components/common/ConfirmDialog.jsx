import styled from 'styled-components';

const DANGER = '#ef4444';

/**
 * 삭제 확인 모달
 * @param {boolean} open
 * @param {string} title
 * @param {string} message
 * @param {function} onConfirm
 * @param {function} onCancel
 * @param {string} confirmLabel
 * @param {string} cancelLabel
 */
export default function ConfirmDialog({
  open,
  title = '삭제하시겠습니까?',
  message,
  onConfirm,
  onCancel,
  confirmLabel = '삭제',
  cancelLabel = '취소',
}) {
  if (!open) return null;

  return (
    <Overlay onClick={onCancel}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalTitle>{title}</ModalTitle>
        {message && <ModalMessage>{message}</ModalMessage>}
        <ButtonRow>
          <CancelBtn type="button" onClick={onCancel}>
            {cancelLabel}
          </CancelBtn>
          <ConfirmBtn type="button" onClick={onConfirm}>
            {confirmLabel}
          </ConfirmBtn>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;
  padding: 28px 32px;
  width: 380px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ModalTitle = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const ModalMessage = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const CancelBtn = styled.button`
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMid};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;

const ConfirmBtn = styled.button`
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: ${DANGER};
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #dc2626;
  }
`;
