import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNoticeDetail, deleteNotice } from '../api/supportApi';

export function useNoticeDetail(noticeId) {
  const navigate = useNavigate();

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    getNoticeDetail(noticeId)
      .then(setNotice)
      .catch((err) => {
        console.error('공지 상세 조회 실패', err);
        setNotice(null);
      })
      .finally(() => setLoading(false));
  }, [noticeId]);

  async function handleDelete() {
    try {
      await deleteNotice(noticeId);
      setShowConfirm(false);
      navigate('/board/support/notice');
    } catch (err) {
      console.error('공지 삭제 실패', err);
      alert('삭제에 실패했습니다.');
    }
  }

  return {
    notice,
    loading,
    showConfirm,
    setShowConfirm,
    handleDelete,
  };
}
