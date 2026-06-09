import styled from 'styled-components';

export const Wrapper = styled.div``;

export const Board = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.textDark};
  margin-bottom: 32px;
`;

export const Row = styled.div`
  display: flex;
  align-items: ${({ $alignTop }) => ($alignTop ? 'flex-start' : 'center')};
  padding: 20px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 24px;
`;

export const Label = styled.div`
  width: 80px;
  flex-shrink: 0;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMid};
  padding-top: 2px;
`;

export const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.fonts.base};
  background: transparent;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

export const TextArea = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.fonts.base};
  background: transparent;
  resize: none;
  min-height: 200px;
  line-height: 1.7;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

/* ── 공지 고정 ── */
export const PinToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const PinCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

export const PinLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMid};
  cursor: pointer;
  font-weight: 500;
`;

export const PinBadge = styled.span`
  padding: 3px 10px;
  border-radius: 9999px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 12px;
  font-weight: 600;
`;

export const FileArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FileLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textMid};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  width: fit-content;
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.accentBlue};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const FileHint = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
`;

export const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.bgSection};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

export const FileName = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
`;

export const RemoveBtn = styled.button`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 4px;
  &:hover {
    color: #ef4444;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const CancelButton = styled.button`
  padding: 11px 28px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textMid};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;

export const SubmitButton = styled.button`
  padding: 11px 28px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;
