import { useParams, useNavigate } from 'react-router-dom';
import { useNoticeDetail } from '../hooks/useNoticeDetail';
import { resolveS3AssetUrl } from '../../../../../app/config/env';
import {
  Wrapper,
  DetailTitle,
  Meta,
  MetaItem,
  MetaLabel,
  MetaValue,
  Divider,
  Body,
  FileSection,
  FileTitle,
  FileList,
  FileItem,
  FileIcon,
  FileName,
  DownloadBtn,
  ActionRow,
  RightButtons,
  BackButton,
  EditButton,
  DeleteButton,
  Overlay,
  Modal,
  ModalText,
  ModalButtons,
  ModalCancel,
  ModalDelete,
} from '../styles/NoticeDetailPage.styles';

function getRole() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const roles = payload.roles ?? [];
    return roles.includes('ADMIN') ? 'ADMIN' : 'USER';
  } catch {
    return null;
  }
}

const isAdmin = getRole() === 'ADMIN';

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
                    const url = resolveS3AssetUrl(file.s3Key);
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
        <BackButton onClick={() => navigate('/notice')}>← 목록으로</BackButton>

        {/* 수정/삭제 버튼 — admin만 표시 */}
        {isAdmin && (
          <RightButtons>
            <EditButton
              onClick={() => navigate(`/notice/write?id=${noticeId}`)}
            >
              수정
            </EditButton>
            <DeleteButton onClick={() => setShowConfirm(true)}>
              삭제
            </DeleteButton>
          </RightButtons>
        )}
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
