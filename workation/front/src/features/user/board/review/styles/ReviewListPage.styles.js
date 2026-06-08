import styled from 'styled-components';

export const Wrapper = styled.div``;

export const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.textDark};
`;

export const ReviewCount = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;

export const Strong = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

export const FeedList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Card = styled.div`
  padding: 28px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;
`;

export const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const HeaderRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
  min-height: 44px;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1.4;
  flex: 1;
`;

export const CardActions = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`;

export const ActionBtn = styled.button`
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid ${({ $danger }) => ($danger ? '#ef4444' : 'currentColor')};
  background: transparent;
  color: ${({ $danger, theme }) =>
    $danger ? '#ef4444' : theme.colors.textMid};
  &:hover {
    background: ${({ $danger, theme }) =>
      $danger ? '#ef4444' : theme.colors.primary};
    color: white;
    border-color: ${({ $danger, theme }) =>
      $danger ? '#ef4444' : theme.colors.primary};
  }
`;

export const WriterMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const WriterName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMid};
`;

export const DateText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const ReviewLikeBtnWrapper = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid
    ${({ $liked, theme }) =>
      $liked ? theme.colors.primary : theme.colors.border};
  background: ${({ $liked, theme }) =>
    $liked ? theme.colors.primary + '15' : 'transparent'};
  color: ${({ $liked, theme }) =>
    $liked ? theme.colors.primary : theme.colors.textMid};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary + '15'};
    color: ${({ theme }) => theme.colors.primary};
  }
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
  margin-bottom: 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
`;

export const ImageItem = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 1/1;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.bgSection};
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s;
    display: block;
  }
  &:hover img {
    transform: scale(1.03);
  }
`;

export const MoreImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: white;
`;

export const ContentArea = styled.div``;

export const CardContent = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textMid};
  white-space: pre-line;
  margin: 0;
  ${({ $expanded }) =>
    !$expanded &&
    `display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;`}
`;

export const MoreBtn = styled.button`
  margin-top: 6px;
  background: none;
  border: none;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  &:hover {
    opacity: 0.75;
  }
`;

export const CommentToggleBtn = styled.button`
  margin-top: 16px;
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSection};
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

export const CommentArea = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const CommentLoading = styled.div`
  padding: 16px 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
`;

export const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

export const CommentCard = styled.div`
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ $isOwner, theme }) =>
    $isOwner ? theme.colors.bgSection : 'white'};
`;

export const CommentTop = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
`;

export const CommentAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $isOwner, theme }) =>
    $isOwner ? theme.colors.primary + '20' : theme.colors.bgSection};
  color: ${({ $isOwner, theme }) =>
    $isOwner ? theme.colors.primary : theme.colors.textMid};
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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
  gap: 8px;
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

export const LikeBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid
    ${({ $liked, theme }) =>
      $liked ? theme.colors.primary : theme.colors.border};
  background: ${({ $liked, theme }) =>
    $liked ? theme.colors.primary + '15' : 'transparent'};
  color: ${({ $liked, theme }) =>
    $liked ? theme.colors.primary : theme.colors.textLight};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary + '15'};
  }
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const LikeCount = styled.span`
  font-size: 12px;
`;

export const CommentBody = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMid};
  line-height: 1.7;
  margin: 0;
`;

export const EmptyComment = styled.div`
  padding: 20px 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 13px;
`;

export const CommentInputBox = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 14px;
  background: ${({ theme }) => theme.colors.bgSection};
`;

export const CommentInputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

export const CommentTextArea = styled.textarea`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textDark};
  resize: none;
  height: 60px;
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
  padding: 0 18px;
  height: 60px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  transition: background 0.15s;
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
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
  font-size: 28px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
`;

export const LightboxPrev = styled.button`
  position: fixed;
  left: 24px;
  font-size: 52px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
`;

export const LightboxNext = styled.button`
  position: fixed;
  right: 24px;
  font-size: 52px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
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

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
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
  margin-top: 40px;
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
  transition: all 0.15s;
  &:hover:not(:disabled) {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.bgSection};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

export const Stars = styled.div`
  display: flex;
  gap: 1px;
`;

export const Star = styled.span`
  font-size: 14px;
  color: ${({ $filled }) => ($filled ? '#f59e0b' : '#e2e8f0')};
`;

export const StayInfo = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primary}10;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;
