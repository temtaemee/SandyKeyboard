import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createNotice, updateNotice, getNoticeDetail } from '../api/supportApi';

function getMemberIdFromToken() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
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
  const [pinYn, setPinYn] = useState('N');
  const [files, setFiles] = useState([]); // 새로 추가할 파일
  const [existingFiles, setExistingFiles] = useState([]); // 기존 파일 목록
  const [deletedFileIds, setDeletedFileIds] = useState([]); // 삭제할 기존 파일 ID
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    getNoticeDetail(editId)
      .then((data) => {
        setTitle(data.title ?? '');
        setContent(data.content ?? '');
        setPinYn(data.pinYn ?? 'N');
        setExistingFiles(data.files ?? []); // 기존 파일 목록 세팅
      })
      .catch((err) => {
        console.error('수정할 공지를 불러오지 못했습니다.', err);
        alert('공지 정보를 불러오지 못했습니다.');
        navigate('/notice');
      })
      .finally(() => setLoadingEdit(false));
  }, [editId]);

  function handleFileChange(e) {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = '';
  }

  // 새로 추가한 파일 제거
  function handleRemoveFile(i) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  // 기존 파일 제거 (삭제 ID 목록에 추가)
  function handleRemoveExistingFile(i) {
    const removed = existingFiles[i];
    if (removed?.id) {
      setDeletedFileIds((prev) => [...prev, removed.id]);
    }
    setExistingFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit() {
    if (!title.trim()) return alert('제목을 입력해주세요.');
    if (!content.trim()) return alert('내용을 입력해주세요.');

    try {
      setSubmitting(true);
      if (isEdit) {
        await updateNotice(
          editId,
          { title, content, pinYn },
          files,
          deletedFileIds
        );
      } else {
        const memberId = getMemberIdFromToken();
        if (!memberId) return alert('로그인이 필요합니다.');
        await createNotice({ memberId, title, content, pinYn }, files);
      }
      navigate('/notice');
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
  };
}
