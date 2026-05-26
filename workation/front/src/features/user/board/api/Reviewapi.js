import axios from 'axios';

const PUBLIC_BASE = 'http://localhost/api/public/board/review';
const USER_BASE = 'http://localhost/api/user/board/review';

const getAuthConfig = () => {
  const token = localStorage.getItem('accessToken');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getImageUrl = (s3Key) => {
  if (!s3Key) return '';
  if (s3Key.startsWith('http')) return s3Key;
  return `https://temp0514-651592874046-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com/${s3Key}`;
};

export const getReviewList = (page = 0) =>
  axios.get(PUBLIC_BASE, { params: { page } }).then((res) => res.data);

export const getReviewDetail = (id) =>
  axios.get(`${PUBLIC_BASE}/${id}`).then((res) => res.data);

export const createReview = (dto, imageFiles) => {
  const formData = new FormData();
  formData.append(
    'dto',
    new Blob([JSON.stringify(dto)], { type: 'application/json' })
  );
  if (imageFiles?.length)
    imageFiles.forEach((file) => formData.append('images', file));
  return axios
    .post(USER_BASE, formData, getAuthConfig())
    .then((res) => res.data);
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
  return axios
    .put(`${USER_BASE}/${id}`, formData, getAuthConfig())
    .then((res) => res.data);
};

export const deleteReview = (id) =>
  axios.delete(`${USER_BASE}/${id}`, getAuthConfig()).then((res) => res.data);

export const getComments = (reviewId) =>
  axios.get(`${PUBLIC_BASE}/${reviewId}/comment`).then((res) => res.data);

export const createComment = (reviewId, dto) =>
  axios
    .post(`${USER_BASE}/${reviewId}/comment`, dto, getAuthConfig())
    .then((res) => res.data);

export const deleteComment = (reviewId, commentId) =>
  axios
    .delete(`${USER_BASE}/${reviewId}/comment/${commentId}`, getAuthConfig())
    .then((res) => res.data);

// 게시글 좋아요 조회
export const getReviewLike = (reviewId) =>
  axios.get(`${PUBLIC_BASE}/${reviewId}/like`).then((res) => res.data);

// 게시글 좋아요 토글
export const toggleReviewLike = (reviewId) =>
  axios
    .post(`${USER_BASE}/${reviewId}/like`, {}, getAuthConfig())
    .then((res) => res.data);

// 댓글 좋아요 조회
export const getCommentLike = (reviewId, commentId) =>
  axios
    .get(`${PUBLIC_BASE}/${reviewId}/comment/${commentId}/like`)
    .then((res) => res.data);

// 댓글 좋아요 토글
export const toggleCommentLike = (reviewId, commentId) =>
  axios
    .post(
      `${USER_BASE}/${reviewId}/comment/${commentId}/like`,
      {},
      getAuthConfig()
    )
    .then((res) => res.data);
