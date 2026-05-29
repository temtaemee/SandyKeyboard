import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createComment,
  deleteComment,
  deleteReview,
  getComments,
  getReviewDetail,
} from '../api/reviewApi';

export function useReviewDetail(reviewId) {
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [commentInput, setCommentInput] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    Promise.all([getReviewDetail(reviewId), getComments(reviewId)])
      .then(([reviewData, commentData]) => {
        console.log('댓글 데이터:', commentData); // ← 이거 추가
        setReview(reviewData);
        setComments(commentData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [reviewId]);

  async function handleDelete() {
    try {
      await deleteReview(reviewId);
      setShowConfirm(false);
      navigate('/board/review');
    } catch (err) {
      console.error(err);
      alert('삭제에 실패했습니다.');
    }
  }

  async function handleCommentSubmit() {
    if (!commentInput.trim()) return;
    try {
      await createComment(reviewId, {
        content: commentInput,
        rating: commentRating,
        ownerYn: 'N',
      });
      const updated = await getComments(reviewId);
      setComments(updated);
      setCommentInput('');
      setCommentRating(5);
    } catch (err) {
      console.error(err);
      alert('댓글 등록에 실패했습니다.');
    }
  }

  async function handleCommentDelete(commentId) {
    try {
      await deleteComment(reviewId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setDeleteCommentId(null);
    } catch (err) {
      console.error(err);
      alert('댓글 삭제에 실패했습니다.');
    }
  }

  return {
    review,
    comments,
    loading,
    commentInput,
    setCommentInput,
    commentRating,
    setCommentRating,
    showConfirm,
    setShowConfirm,
    deleteCommentId,
    setDeleteCommentId,
    lightboxIdx,
    setLightboxIdx,
    handleDelete,
    handleCommentSubmit,
    handleCommentDelete,
  };
}
