import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export default function ReviewWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);

  function handleFileChange(e) {
    const selected = [...e.target.files];
    setFiles(selected);
  }

  function handleRemoveFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (!title.trim()) return alert('제목을 입력해주세요.');
    if (!content.trim()) return alert('내용을 입력해주세요.');
    console.log(title, content, files);
    navigate('/board/review/list');
  }

  return (
    <Wrapper>
      <Board>
        <Row>
          <Label>제목</Label>
          <Input
            type="text"
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
                accept="image/jpeg, image/png, image/gif, image/webp"
                onChange={handleFileChange}
              />
            </FileLabel>
            <FileHint>JPG, PNG, GIF, WEBP 파일만 첨부 가능합니다</FileHint>

            {files.length > 0 && (
              <FileList>
                {files.map((file, index) => (
                  <FileItem key={index}>
                    <FileName>🖼 {file.name}</FileName>
                    <RemoveBtn onClick={() => handleRemoveFile(index)}>
                      ✕
                    </RemoveBtn>
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
  border-top: 2px solid black;
  margin-bottom: 32px;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 20px 10px;
  border-bottom: 1px solid #e5e7eb;
  gap: 24px;
`;

const Label = styled.div`
  width: 80px;
  flex-shrink: 0;
  font-weight: 600;
  color: #333;
  padding-top: 2px;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #333;

  &::placeholder {
    color: #bbb;
  }
`;

const TextArea = styled.textarea`
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  color: #333;
  resize: none;
  min-height: 200px;
  line-height: 1.7;

  &::placeholder {
    color: #bbb;
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
  padding: 10px 20px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #333;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  width: fit-content;

  &:hover {
    background: #f3f4f6;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileHint = styled.div`
  font-size: 12px;
  color: #bbb;
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
  background: #f9fafb;
  border-radius: 8px;
`;

const FileName = styled.span`
  font-size: 13px;
  color: #444;
`;

const RemoveBtn = styled.button`
  font-size: 12px;
  color: #999;
  cursor: pointer;
  background: none;
  border: none;
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
  padding: 12px 28px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #f3f4f6;
  }
`;

const SubmitButton = styled.button`
  padding: 12px 28px;
  border-radius: 999px;
  border: none;
  background: black;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #222;
  }
`;
