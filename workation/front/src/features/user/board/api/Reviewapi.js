import axios from 'axios';

const PUBLIC_BASE = 'http://localhost/api/public/board/review';
const USER_BASE = 'http://localhost/api/user/board/review';

const getAuthConfig = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 목록 조회 (페이징)
// 백엔드: GET /api/public/board/review?page=0
// 응답: { content: [...], totalPages, totalElements, ... }
export const getReviewList = (page = 0) =>
  axios.get(PUBLIC_BASE, { params: { page } }).then((res) => res.data);

// 상세 조회
export const getReviewDetail = (id) =>
  axios.get(`${PUBLIC_BASE}/${id}`).then((res) => res.data);

// 등록
export const createReview = (dto, imageFiles) => {
  const formData = new FormData();
  formData.append(
    'dto',
    new Blob([JSON.stringify(dto)], { type: 'application/json' })
  );
  if (imageFiles?.length) {
    imageFiles.forEach((file) => formData.append('images', file));
  }
  return axios
    .post(USER_BASE, formData, getAuthConfig())
    .then((res) => res.data);
};

// 수정
export const updateReview = (id, dto, imageFiles) => {
  const formData = new FormData();
  formData.append(
    'dto',
    new Blob([JSON.stringify(dto)], { type: 'application/json' })
  );
  if (imageFiles?.length) {
    imageFiles.forEach((file) => formData.append('images', file));
  }
  return axios
    .put(`${USER_BASE}/${id}`, formData, getAuthConfig())
    .then((res) => res.data); 
};

// 삭제
export const deleteReview = (id) =>
  axios.delete(`${USER_BASE}/${id}`, getAuthConfig()).then((res) => res.data);

// 댓글 목록
export const getComments = (reviewId) =>
  axios.get(`${PUBLIC_BASE}/${reviewId}/comment`).then((res) => res.data);

// 댓글 등록
export const createComment = (reviewId, dto) =>
  axios
    .post(`${USER_BASE}/${reviewId}/comment`, dto, getAuthConfig())
    .then((res) => res.data);

// 댓글 삭제
export const deleteComment = (reviewId, commentId) =>
  axios
    .delete(`${USER_BASE}/${reviewId}/comment/${commentId}`, getAuthConfig())
    .then((res) => res.data);
