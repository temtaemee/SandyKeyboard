import api from '../../../../../app/api/axios';

// ================================
// 리뷰 게시판 API 주소
// ================================

// 사용자 전체 공개 조회용
const PUBLIC_BASE = '/public/reviews';

// 로그인 사용자 기능용
const USER_BASE = '/user/reviews';

// ================================
// 이미지 URL 변환 함수
// ================================

/**
 * S3 이미지 주소 생성
 *
 * - s3Key가 이미 http 주소면 그대로 반환
 * - 아니면 S3 버킷 주소와 합쳐서 완전한 이미지 URL 생성
 */
export const getImageUrl = (s3Key) => {
  if (!s3Key) return '';
  if (s3Key.startsWith('http')) return s3Key;
  return `https://finalproject-s3-bucket-243050855199-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com/${s3Key}`;
};

// ================================
// 리뷰 게시글 API
// ================================

/**
 * 리뷰 목록 조회
 *
 * page : 페이지 번호
 */
export const getReviewList = (page = 0) =>
  api.get(PUBLIC_BASE, { params: { page } }).then((res) => res.data);

/**
 * 내 리뷰 목록 조회 (로그인 필요)
 *
 * page : 페이지 번호
 */
export const getMyReviewList = (page = 0) =>
  api.get(`${USER_BASE}/my`, { params: { page } }).then((res) => res.data);

/**
 * 리뷰 작성 가능한 예약 목록 조회 (이용 완료 + 리뷰 미작성)
 */
export const getUnreviewedReservations = () =>
  api.get(`${USER_BASE}/unreviewed-reservations`).then((res) => res.data);

/**
 * 리뷰 상세 조회
 *
 * id : 리뷰 게시글 번호
 */
export const getReviewDetail = (id) =>
  api.get(`${PUBLIC_BASE}/${id}`).then((res) => res.data);

/**
 * 리뷰 등록
 *
 * dto        : 리뷰 제목/내용 데이터
 * imageFiles : 업로드 이미지 파일 배열
 *
 * multipart/form-data 방식 사용
 */
export const createReview = (dto, imageFiles) => {
  const formData = new FormData();

  // 리뷰 데이터 추가
  formData.append(
    'dto',
    new Blob([JSON.stringify(dto)], { type: 'application/json' })
  );

  // 이미지 파일 추가
  if (imageFiles?.length)
    imageFiles.forEach((file) => formData.append('images', file));

  return api.post(USER_BASE, formData).then((res) => res.data);
};

/**
 * 리뷰 수정
 *
 * id               : 수정할 리뷰 번호
 * dto              : 수정 데이터
 * imageFiles       : 새로 추가할 이미지
 * deletedImageIds  : 삭제할 기존 이미지 번호 배열
 */
export const updateReview = (id, dto, imageFiles, deletedImageIds = []) => {
  const formData = new FormData();

  // 수정 데이터 추가
  formData.append(
    'dto',
    new Blob([JSON.stringify(dto)], { type: 'application/json' })
  );

  // 새 이미지 추가
  if (imageFiles?.length)
    imageFiles.forEach((file) => formData.append('images', file));

  // 삭제할 이미지 번호 추가
  if (deletedImageIds?.length)
    deletedImageIds.forEach((imgId) =>
      formData.append('deletedImageIds', imgId)
    );

  return api.put(`${USER_BASE}/${id}`, formData).then((res) => res.data);
};

/**
 * 리뷰 삭제
 *
 * id : 삭제할 리뷰 번호
 */
export const deleteReview = (id) =>
  api.delete(`${USER_BASE}/${id}`).then((res) => res.data);

// ================================
// 댓글 API
// ================================

/**
 * 댓글 목록 조회
 *
 * reviewId : 리뷰 게시글 번호
 */
export const getComments = (reviewId) =>
  api.get(`${PUBLIC_BASE}/${reviewId}/comments`).then((res) => res.data);

/**
 * 댓글 등록
 *
 * reviewId : 리뷰 게시글 번호
 * dto      : 댓글 데이터
 */
export const createComment = (reviewId, dto) =>
  api.post(`${USER_BASE}/${reviewId}/comments`, dto).then((res) => res.data);

/**
 * 댓글 수정
 *
 * commentId : 댓글 번호
 * dto       : 댓글 데이터
 */
export const updateComment = (commentId, dto) =>
  api.put(`/user/comments/${commentId}`, dto).then((res) => res.data);

/**
 * 댓글 삭제
 *
 * reviewId  : 리뷰 번호
 * commentId : 댓글 번호
 */
export const deleteComment = (reviewId, commentId) =>
  api.delete(`/user/comments/${commentId}`).then((res) => res.data);

// ================================
// 게시글 좋아요 API
// ================================

/**
 * 게시글 좋아요 상태 조회
 *
 * reviewId : 리뷰 번호
 */
export const getReviewLike = (reviewId) =>
  api.get(`${PUBLIC_BASE}/${reviewId}/like`).then((res) => res.data);

/**
 * 게시글 좋아요 토글 (기능명세서 상 추가/삭제로 분기)
 *
 * reviewId : 리뷰 번호
 * liked    : 현재 좋아요 상태
 */
export const toggleReviewLike = (reviewId, liked) => {
  if (liked) {
    return api.delete(`${USER_BASE}/${reviewId}/like`).then((res) => res.data);
  } else {
    return api
      .post(`${USER_BASE}/${reviewId}/like`, {})
      .then((res) => res.data);
  }
};

// ================================
// 댓글 좋아요 API
// ================================

/**
 * 댓글 좋아요 상태 조회
 *
 * reviewId  : 리뷰 번호
 * commentId : 댓글 번호
 */
export const getCommentLike = (reviewId, commentId) =>
  api
    .get(`${PUBLIC_BASE}/${reviewId}/comments/${commentId}/like`)
    .then((res) => res.data);

/**
 * 댓글 좋아요 토글
 *
 * reviewId  : 리뷰 번호
 * commentId : 댓글 번호
 */
export const toggleCommentLike = (reviewId, commentId) =>
  api
    .post(`${USER_BASE}/${reviewId}/comments/${commentId}/like`, {})
    .then((res) => res.data);

// ================================
// 별점 API (기능명세서 추가)
// ================================

export const addReviewRating = (reviewId, rating) =>
  api
    .post(`${USER_BASE}/${reviewId}/rating`, { rating })
    .then((res) => res.data);

export const updateReviewRating = (reviewId, rating) =>
  api
    .put(`${USER_BASE}/${reviewId}/rating`, { rating })
    .then((res) => res.data);

// ================================
// 리뷰 관리자 API (기능명세서 추가)
// ================================

export const hideReview = (reviewId) =>
  api.put(`/admin/reviews/${reviewId}/hide`, {}).then((res) => res.data);

// 댓글 숨김 처리 (admin)
export const hideComment = (reviewId, commentId) =>
  api
    .put(`/admin/reviews/${reviewId}/comments/${commentId}/hide`)
    .then((res) => res.data);

// 댓글 숨김 해제 (admin)
export const showComment = (reviewId, commentId) =>
  api
    .put(`/admin/reviews/${reviewId}/comments/${commentId}/show`)
    .then((res) => res.data);
