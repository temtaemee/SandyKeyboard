import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useNoticeDetail } from '../hooks/useNoticeDetail';

export default function NoticeDetailPage() {
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const { notice, loading, showConfirm, setShowConfirm, handleDelete } =
    useNoticeDetail(noticeId);

  if (loading)
    return (
      <Wrapper>
        <p>불러오는 중...</p>
      </Wrapper>
    );
  if (!notice)
    return (
      <Wrapper>
        <p>존재하지 않는 공지사항입니다.</p>
      </Wrapper>
    );

  return (
    <Wrapper>
      <DetailTitle>{notice.title}</DetailTitle>
      <Meta>
        <MetaItem>
          <MetaLabel>작성자</MetaLabel>
          <MetaValue>{notice.writer}</MetaValue>
        </MetaItem>
        <MetaItem>
          <MetaLabel>작성일</MetaLabel>
          <MetaValue>
            {notice.createdAt
              ? new Date(notice.createdAt).toLocaleDateString('ko-KR')
              : ''}
          </MetaValue>
        </MetaItem>
      </Meta>
      <Divider />
      <Body>{notice.content}</Body>

      {notice.files && notice.files.length > 0 && (
        <FileSection>
          <FileTitle>첨부파일</FileTitle>
          <FileList>
            {notice.files.map((file) => (
              <FileItem key={file.id}>
                <FileIcon>📎</FileIcon>
                <FileName>{file.originalFileName}</FileName>
                <DownloadBtn
                  onClick={async () => {
                    const url = `https://temp0514-651592874046-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com/${file.s3Key}`;
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = file.originalFileName;
                    a.click();
                    URL.revokeObjectURL(blobUrl);
                  }}
                >
                  다운로드
                </DownloadBtn>
              </FileItem>
            ))}
          </FileList>
        </FileSection>
      )}

      <ActionRow>
        <BackButton onClick={() => navigate('/board/support/notice')}>
          ← 목록으로
        </BackButton>
        <RightButtons>
          <EditButton
            onClick={() =>
              navigate(`/board/support/notice/write?id=${noticeId}`)
            }
          >
            수정
          </EditButton>
          <DeleteButton onClick={() => setShowConfirm(true)}>삭제</DeleteButton>
        </RightButtons>
      </ActionRow>

      {showConfirm && (
        <Overlay>
          <Modal>
            <ModalText>정말 삭제하시겠습니까?</ModalText>
            <ModalButtons>
              <ModalCancel onClick={() => setShowConfirm(false)}>
                취소
              </ModalCancel>
              <ModalDelete onClick={handleDelete}>삭제</ModalDelete>
            </ModalButtons>
          </Modal>
        </Overlay>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div``;
const DetailTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.textDark};
`;
const Meta = styled.div`
  display: flex;
  gap: 28px;
  margin-bottom: 20px;
`;
const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const MetaLabel = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
`;
const MetaValue = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
  font-weight: 600;
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 32px;
`;
const Body = styled.pre`
  font-size: 15px;
  line-height: 1.9;
  color: ${({ theme }) => theme.colors.textMid};
  margin-bottom: 48px;
  white-space: pre-wrap;
  font-family: ${({ theme }) => theme.fonts.base};
`;
const FileSection = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 20px 24px;
  margin-bottom: 40px;
  background: ${({ theme }) => theme.colors.bgSection};
`;
const FileTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 14px;
`;
const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const FileIcon = styled.span`
  font-size: 16px;
`;
const FileName = styled.span`
  flex: 1;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMid};
`;
const DownloadBtn = styled.button`
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
const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const RightButtons = styled.div`
  display: flex;
  gap: 10px;
`;
const BackButton = styled.button`
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
const EditButton = styled.button`
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
const DeleteButton = styled.button`
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
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;
const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  box-shadow: ${({ theme }) => theme.shadows.cardHover};
`;
const ModalText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;
const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
`;
const ModalCancel = styled.button`
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
const ModalDelete = styled.button`
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
