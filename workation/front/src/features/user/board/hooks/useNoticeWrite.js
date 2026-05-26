import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createNotice, updateNotice, getNoticeDetail } from '../api/Supportapi';

// JWT 토큰에서 memberId 추출
function getMemberIdFromToken() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('토큰 payload:', payload); // 어떤 키가 있는지 확인용
    return payload.id ?? payload.memberId ?? payload.sub;
  } catch {
    return null;
  }
}

export function useNoticeWrite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const editId = searchParams.get('id');
  const isEdit = !!editId;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(isEdit);

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
    const selected = Array.from(e.target.files); // ← 이렇게 변경
    console.log('파일 선택됨:', selected);
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = '';
  }

  function handleRemoveFile(i) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit() {
    console.log('files 상태:', files); // ← 추가
    console.log('handleSubmit 실행됨!');
    console.log('title:', title, 'content:', content);
    if (!title.trim()) return alert('제목을 입력해주세요.');
    if (!content.trim()) return alert('내용을 입력해주세요.');

    try {
      setSubmitting(true);
      if (isEdit) {
        await updateNotice(editId, { title, content });
      } else {
        const memberId = getMemberIdFromToken();
        if (!memberId) return alert('로그인이 필요합니다.');
        await createNotice({ memberId, title, content }, files);
      }
      navigate('/board/support/notice');
    } catch (err) {
      console.error('공지 저장 실패', err);
      alert(isEdit ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  return {
    isEdit,
    title,
    setTitle,
    content,
    setContent,
    files,
    submitting,
    loadingEdit,
    handleFileChange,
    handleRemoveFile,
    handleSubmit,
  };
}
