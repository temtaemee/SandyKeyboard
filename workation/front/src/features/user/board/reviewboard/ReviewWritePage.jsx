import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export default function ReviewWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);

  function handleFileChange(e) {
    setFiles([...e.target.files]);
  }
  function handleRemoveFile(i) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }
  function handleSubmit() {
    if (!title.trim()) return alert('제목을 입력해주세요.');
    if (!content.trim()) return alert('내용을 입력해주세요.');
    navigate('/board/review/list');
  }

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
        <Row>
          <Label>내용</Label>
          <TextArea
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Row>
        <Row>
          <Label>이미지 첨부</Label>
          <FileArea>
            <FileLabel htmlFor="image-upload">
              📷 이미지 선택
              <FileInput
                id="image-upload"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
              />
            </FileLabel>
            <FileHint>JPG, PNG, GIF, WEBP 파일만 첨부 가능합니다</FileHint>
            {files.length > 0 && (
              <FileList>
                {files.map((file, i) => (
                  <FileItem key={i}>
                    <FileName>🖼 {file.name}</FileName>
                    <RemoveBtn onClick={() => handleRemoveFile(i)}>✕</RemoveBtn>
                  </FileItem>
                ))}
              </FileList>
            )}
          </FileArea>
        </Row>
      </Board>

      <ButtonGroup>
        <CancelButton onClick={() => navigate('/board/review/list')}>
          취소
        </CancelButton>
        <SubmitButton onClick={handleSubmit}>등록</SubmitButton>
      </ButtonGroup>
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const Board = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.textDark};
  margin-bottom: 32px;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
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
  transition: background 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;
