import api from '../../../../../app/api/axios';

const PUBLIC_BASE = '/public/board/review';
const USER_BASE = '/user/board/review';

export const getImageUrl = (s3Key) => {
  if (!s3Key) return '';
  if (s3Key.startsWith('http')) return s3Key;
  return `https://temp0514-651592874046-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com/${s3Key}`;
};

export const getReviewList = (page = 0) =>
  api.get(PUBLIC_BASE, { params: { page } }).then((res) => res.data);

export const getReviewDetail = (id) =>
  api.get(`${PUBLIC_BASE}/${id}`).then((res) => res.data);

export const createReview = (dto, imageFiles) => {
  const formData = new FormData();
  formData.append(
    'dto',
    new Blob([JSON.stringify(dto)], { type: 'application/json' })
  );
  if (imageFiles?.length)
    imageFiles.forEach((file) => formData.append('images', file));
  return api.post(USER_BASE, formData).then((res) => res.data);
};

export const updateReview = (id, dto, imageFiles, deletedImageIds = []) => {
  const formData = new FormData();
  formData.append(
    'dto',
    new Blob([JSON.stringify(dto)], { type: 'application/json' })
  );
  if (imageFiles?.length)
    imageFiles.forEach((file) => formData.append('images', file));
  if (deletedImageIds?.length)
    deletedImageIds.forEach((imgId) =>
      formData.append('deletedImageIds', imgId)
    );
  return api.put(`${USER_BASE}/${id}`, formData).then((res) => res.data);
};

export const deleteReview = (id) =>
  api.delete(`${USER_BASE}/${id}`).then((res) => res.data);

export const getComments = (reviewId) =>
  api.get(`${PUBLIC_BASE}/${reviewId}/comment`).then((res) => res.data);

export const createComment = (reviewId, dto) =>
  api.post(`${USER_BASE}/${reviewId}/comment`, dto).then((res) => res.data);

export const deleteComment = (reviewId, commentId) =>
  api
    .delete(`${USER_BASE}/${reviewId}/comment/${commentId}`)
    .then((res) => res.data);

// 게시글 좋아요 조회
export const getReviewLike = (reviewId) =>
  api.get(`${PUBLIC_BASE}/${reviewId}/like`).then((res) => res.data);

// 게시글 좋아요 토글
export const toggleReviewLike = (reviewId) =>
  api.post(`${USER_BASE}/${reviewId}/like`, {}).then((res) => res.data);

// 댓글 좋아요 조회
export const getCommentLike = (reviewId, commentId) =>
  api
    .get(`${PUBLIC_BASE}/${reviewId}/comment/${commentId}/like`)
    .then((res) => res.data);

// 댓글 좋아요 토글
export const toggleCommentLike = (reviewId, commentId) =>
  api
    .post(`${USER_BASE}/${reviewId}/comment/${commentId}/like`, {})
    .then((res) => res.data);
