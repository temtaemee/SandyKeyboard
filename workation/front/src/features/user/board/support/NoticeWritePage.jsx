import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { createNotice, updateNotice, getNoticeDetail } from '../api/Supportapi';

// TODO: 로그인 연동 후 실제 memberId로 교체
const TEMP_MEMBER_ID = 1;

export default function NoticeWritePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL에 ?id=123 이 있으면 수정 모드 (리뷰와 동일한 패턴)
  const editId = searchParams.get('id');
  const isEdit = !!editId;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]); // 새로 첨부할 파일
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(isEdit);

  // 수정 모드: 기존 데이터 불러오기
  useEffect(() => {
    if (!isEdit) return;
    getNoticeDetail(editId)
      .then((data) => {
        setTitle(data.title ?? '');
        setContent(data.content ?? '');
      })
      .catch((err) => {
        console.error('수정할 공지를 불러오지 못했습니다.', err);
        alert('공지 정보를 불러오지 못했습니다.');
        navigate('/board/support/notice');
      })
      .finally(() => setLoadingEdit(false));
  }, [editId]);

  function handleFileChange(e) {
    setFiles((prev) => [...prev, ...e.target.files]);
    e.target.value = '';
  }
  function handleRemoveFile(i) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit() {
    if (!title.trim()) return alert('제목을 입력해주세요.');
    if (!content.trim()) return alert('내용을 입력해주세요.');

    try {
      setSubmitting(true);
      if (isEdit) {
        // 수정  PUT /api/board/notice/{id}  — JSON (백엔드 수정 API는 파일 미지원)
        await updateNotice(editId, { title, content });
      } else {
        // 등록  POST /api/board/notice  — multipart/form-data
        await createNotice({ memberId: TEMP_MEMBER_ID, title, content }, files);
      }
      navigate('/board/support/notice');
    } catch (err) {
      console.error('공지 저장 실패', err);
      alert(isEdit ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingEdit)
    return (
      <Wrapper>
        <p>불러오는 중...</p>
      </Wrapper>
    );

  return (
    <Wrapper>
      <Board>
        <Row>
          <Label>제목</Label>
          <Input
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Row>

        <Row $alignTop>
          <Label>내용</Label>
          <TextArea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Row>

        {/* 파일 첨부 — 수정 모드에서는 숨김 (백엔드 수정 API 파일 미지원) */}
        {!isEdit && (
          <Row $alignTop>
            <Label>파일 첨부</Label>
            <FileArea>
              <FileLabel htmlFor="notice-file-upload">
                📎 파일 선택
                <FileInput
                  id="notice-file-upload"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </FileLabel>
              <FileHint>모든 파일 형식 첨부 가능합니다</FileHint>
              {files.length > 0 && (
                <FileList>
                  {files.map((file, i) => (
                    <FileItem key={i}>
                      <FileName>📎 {file.name}</FileName>
                      <RemoveBtn onClick={() => handleRemoveFile(i)}>
                        ✕
                      </RemoveBtn>
                    </FileItem>
                  ))}
                </FileList>
              )}
            </FileArea>
          </Row>
        )}
      </Board>

      <ButtonGroup>
        <CancelButton onClick={() => navigate('/board/support/notice')}>
          취소
        </CancelButton>
        <SubmitButton onClick={handleSubmit} disabled={submitting}>
          {submitting
            ? isEdit
              ? '수정 중...'
              : '등록 중...'
            : isEdit
              ? '수정 완료'
              : '등록'}
        </SubmitButton>
      </ButtonGroup>
    </Wrapper>
  );
}

/* ── Styled Components (기존 유지) ── */
const Wrapper = styled.div``;
const Board = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.textDark};
  margin-bottom: 32px;
`;
const Row = styled.div`
  display: flex;
  align-items: ${({ $alignTop }) => ($alignTop ? 'flex-start' : 'center')};
  padding: 20px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  gap: 24px;
`;
const Label = styled.div`
  width: 80px;
  flex-shrink: 0;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMid};
  padding-top: 2px;
`;
const Input = styled.input`
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
const TextArea = styled.textarea`
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
const FileArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const FileLabel = styled.label`
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
const FileInput = styled.input`
  display: none;
`;
const FileHint = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
`;
const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
`;
const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.bgSection};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
`;
const FileName = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
`;
const RemoveBtn = styled.button`
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
const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;
const CancelButton = styled.button`
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
const SubmitButton = styled.button`
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
