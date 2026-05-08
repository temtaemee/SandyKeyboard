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

  function handleSubmit(e) {
    e.preventDefault();
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
          <Label>파일 첨부</Label>
          <FileInput type="file" multiple onChange={handleFileChange} />
        </Row>
      </Board>

      <ButtonGroup>
        <CancelButton
          type="button"
          onClick={() => navigate('/board/review/list')}
        >
          취소
        </CancelButton>
        <SubmitButton type="submit" onClick={handleSubmit}>
          등록
        </SubmitButton>
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

const FileInput = styled.input`
  flex: 1;
  font-size: 14px;
  color: #666;
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
