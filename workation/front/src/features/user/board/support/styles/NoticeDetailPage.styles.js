import styled from 'styled-components';

export const Wrapper = styled.div``;

export const DetailTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.textDark};
`;

export const Meta = styled.div`
  display: flex;
  gap: 28px;
  margin-bottom: 20px;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const MetaLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const MetaValue = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
  font-weight: 600;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 32px;
`;

export const Body = styled.pre`
  font-size: 15px;
  line-height: 1.9;
  color: ${({ theme }) => theme.colors.textMid};
  margin-bottom: 48px;
  white-space: pre-wrap;
  font-family: ${({ theme }) => theme.fonts.base};
`;

export const FileSection = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 20px 24px;
  margin-bottom: 40px;
  background: ${({ theme }) => theme.colors.bgSection};
`;

export const FileTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 14px;
`;

export const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const FileIcon = styled.span`
  font-size: 16px;
`;

export const FileName = styled.span`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMid};
`;

export const DownloadBtn = styled.button`
  padding: 6px 16px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textMid};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.accentBlue};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RightButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export const BackButton = styled.button`
  padding: 10px 22px;
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

export const EditButton = styled.button`
  padding: 10px 22px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

export const DeleteButton = styled.button`
  padding: 10px 22px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: #ef4444;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: #dc2626;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

export const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  box-shadow: ${({ theme }) => theme.shadows.cardHover};
`;

export const ModalText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
`;

export const ModalCancel = styled.button`
  padding: 12px 28px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textMid};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;

export const ModalDelete = styled.button`
  padding: 12px 28px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: #ef4444;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: #dc2626;
  }
`;
