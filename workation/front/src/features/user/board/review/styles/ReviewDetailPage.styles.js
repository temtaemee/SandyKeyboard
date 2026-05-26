import styled from 'styled-components';

export const Stars = styled.div`
  display: flex;
  gap: 1px;
`;

export const Star = styled.span`
  font-size: ${({ $size }) => $size ?? 20}px;
  color: ${({ $filled }) => ($filled ? '#f59e0b' : '#e2e8f0')};
  cursor: ${({ $interactive }) => ($interactive ? 'pointer' : 'default')};
  transition: color 0.1s;
  line-height: 1;
`;

export const AvatarCircle = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $isOwner, theme }) =>
    $isOwner ? theme.colors.primary + '20' : theme.colors.bgSection};
  color: ${({ $isOwner, theme }) =>
    $isOwner ? theme.colors.primary : theme.colors.textMid};
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const Wrapper = styled.div`
  max-width: 780px;
`;

export const LoadingWrapper = styled.div`
  padding: 80px 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 15px;
`;

/* ── 헤더 ── */
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 28px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Writer = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;

export const Dot = styled.span`
  color: ${({ theme }) => theme.colors.border};
  font-size: 13px;
`;

export const DateText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`;

export const EditBtn = styled.button`
  padding: 7px 18px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  color: ${({ theme }) => theme.colors.textMid};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const DeleteBtn = styled.button`
  padding: 7px 18px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid transparent;
  background: #fef2f2;
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: #ef4444;
    color: white;
  }
`;

/* ── 이미지 ── */
export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $count }) => Math.min($count, 4)}, 1fr);
  gap: 6px;
  margin-bottom: 24px;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const ImageItem = styled.div`
  aspect-ratio: 1 / 1;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  background: ${({ theme }) => theme.colors.bgSection};
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.25s ease;
  }
  &:hover img {
    transform: scale(1.05);
  }
`;

export const MoreOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
`;

/* ── 태그 ── */
export const TagPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme }) => theme.colors.bgSection};
  border-radius: ${({ theme }) => theme.radius.full};
  padding: 5px 14px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
  margin-bottom: 20px;
`;

export const TagDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

/* ── 본문 ── */
export const Body = styled.p`
  font-size: 15px;
  line-height: 1.9;
  color: ${({ theme }) => theme.colors.textMid};
  margin-bottom: 32px;
  white-space: pre-line;
`;

/* ── 목록으로 ── */
export const BackRow = styled.div`
  margin-bottom: 48px;
`;

export const BackBtn = styled.button`
  padding: 0;
  background: none;
  border: none;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color 0.15s;
  &:hover {
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

/* ── 댓글 섹션 ── */
export const CommentSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 32px;
`;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

export const CommentTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
`;

export const CommentBadge = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary}18;
  border-radius: ${({ theme }) => theme.radius.full};
  padding: 2px 8px;
`;

export const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
`;

export const CommentCard = styled.div`
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $isOwner, theme }) =>
    $isOwner ? theme.colors.bgSection : 'white'};
`;

export const CommentCardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

export const CommentWriter = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $isOwner, theme }) =>
    $isOwner ? theme.colors.primary : theme.colors.textDark};
`;

export const OwnerBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary}18;
  border-radius: ${({ theme }) => theme.radius.full};
  padding: 2px 8px;
`;

export const CommentMeta = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CommentDate = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const CommentDelBtn = styled.button`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;
  &:hover {
    color: #ef4444;
  }
`;

export const CommentBody = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMid};
  line-height: 1.7;
  margin: 0;
`;

export const EmptyComment = styled.div`
  padding: 32px 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 14px;
`;

/* ── 댓글 입력 ── */
export const CommentInputBox = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 16px;
  background: ${({ theme }) => theme.colors.bgSection};
`;

export const CommentInputTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

export const CommentInputLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMid};
`;

export const CommentInputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

export const CommentTextArea = styled.textarea`
  flex: 1;
  padding: 11px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textDark};
  resize: none;
  height: 64px;
  outline: none;
  font-family: ${({ theme }) => theme.fonts.base};
  background: white;
  transition: border-color 0.15s;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const CommentSubmitBtn = styled.button`
  padding: 0 20px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

/* ── 라이트박스 ── */
export const LightboxOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
`;

export const LightboxImg = styled.img`
  max-width: 80vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.radius.md};
`;

export const LightboxClose = styled.button`
  position: fixed;
  top: 24px;
  right: 32px;
  font-size: 24px;
  color: rgba(255, 255, 255, 0.7);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
  &:hover {
    color: white;
  }
`;

export const LightboxPrev = styled.button`
  position: fixed;
  left: 24px;
  font-size: 48px;
  color: rgba(255, 255, 255, 0.7);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
  &:hover {
    color: white;
  }
`;

export const LightboxNext = styled.button`
  position: fixed;
  right: 24px;
  font-size: 48px;
  color: rgba(255, 255, 255, 0.7);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
  &:hover {
    color: white;
  }
`;

/* ── 모달 ── */
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

export const Modal = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
`;

export const ModalText = styled.p`
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
`;

export const ModalButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export const ModalCancel = styled.button`
  padding: 11px 28px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  color: ${({ theme }) => theme.colors.textMid};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;

export const ModalDelete = styled.button`
  padding: 11px 28px;
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
