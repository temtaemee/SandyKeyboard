import { useNavigate } from 'react-router-dom';
import { useNoticeWrite } from '../hooks/useNoticeWrite';
import {
  Wrapper,
  Board,
  Row,
  Label,
  Input,
  TextArea,
  PinToggle,
  PinCheckbox,
  PinLabel,
  PinBadge,
  FileArea,
  FileLabel,
  FileInput,
  FileHint,
  FileList,
  FileItem,
  FileName,
  RemoveBtn,
  ButtonGroup,
  CancelButton,
  SubmitButton,
} from '../styles/NoticeWritePage.styles';

export default function NoticeWritePage() {
  const navigate = useNavigate();
  const {
    isEdit,
    title,
    setTitle,
    content,
    setContent,
    pinYn,
    setPinYn,
    files,
    existingFiles,
    submitting,
    loadingEdit,
    handleFileChange,
    handleRemoveFile,
    handleRemoveExistingFile,
    handleSubmit,
  } = useNoticeWrite();

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

        {/* 공지 고정 여부 */}
        <Row>
          <Label>공지 설정</Label>
          <PinToggle>
            <PinCheckbox
              type="checkbox"
              id="pinYn"
              checked={pinYn === 'Y'}
              onChange={(e) => setPinYn(e.target.checked ? 'Y' : 'N')}
            />
            <PinLabel htmlFor="pinYn">상단 공지로 고정</PinLabel>
            {pinYn === 'Y' && <PinBadge>📌 공지</PinBadge>}
          </PinToggle>
        </Row>

        {/* 파일 첨부 — 등록/수정 모두 표시 */}
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

            <FileList>
              {/* 기존 파일 목록 (수정 시) */}
              {existingFiles.map((file, i) => (
                <FileItem key={`existing-${file.id}`}>
                  <FileName>📎 {file.originalFileName}</FileName>
                  <RemoveBtn onClick={() => handleRemoveExistingFile(i)}>
                    ✕
                  </RemoveBtn>
                </FileItem>
              ))}

              {/* 새로 추가한 파일 목록 */}
              {files.map((file, i) => (
                <FileItem key={`new-${i}`}>
                  <FileName>📎 {file.name}</FileName>
                  <RemoveBtn onClick={() => handleRemoveFile(i)}>✕</RemoveBtn>
                </FileItem>
              ))}
            </FileList>
          </FileArea>
        </Row>
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
