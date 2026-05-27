import api from '../../../../../app/api/axios';

// ================================
// 리뷰 게시판 API 주소
// ================================

// 사용자 전체 공개 조회용
const PUBLIC_BASE = '/public/board/review';

// 로그인 사용자 기능용
const USER_BASE = '/user/board/review';

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

  // 이미 전체 URL이면 그대로 사용
  if (s3Key.startsWith('http')) return s3Key;

  // S3 경로 생성
  return `https://temp0514-651592874046-ap-northeast-2-an.s3.ap-northeast-2.amazonaws.com/${s3Key}`;
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
  api.get(`${PUBLIC_BASE}/${reviewId}/comment`).then((res) => res.data);

/**
 * 댓글 등록
 *
 * reviewId : 리뷰 게시글 번호
 * dto      : 댓글 데이터
 */
export const createComment = (reviewId, dto) =>
  api.post(`${USER_BASE}/${reviewId}/comment`, dto).then((res) => res.data);

/**
 * 댓글 삭제
 *
 * reviewId  : 리뷰 번호
 * commentId : 댓글 번호
 */
export const deleteComment = (reviewId, commentId) =>
  api
    .delete(`${USER_BASE}/${reviewId}/comment/${commentId}`)
    .then((res) => res.data);

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
 * 게시글 좋아요 토글
 *
 * - 이미 좋아요면 취소
 * - 아니면 좋아요 추가
 *
 * reviewId : 리뷰 번호
 */
export const toggleReviewLike = (reviewId) =>
  api.post(`${USER_BASE}/${reviewId}/like`, {}).then((res) => res.data);

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
    .get(`${PUBLIC_BASE}/${reviewId}/comment/${commentId}/like`)
    .then((res) => res.data);

/**
 * 댓글 좋아요 토글
 *
 * - 이미 좋아요면 취소
 * - 아니면 좋아요 추가
 *
 * reviewId  : 리뷰 번호
 * commentId : 댓글 번호
 */
export const toggleCommentLike = (reviewId, commentId) =>
  api
    .post(`${USER_BASE}/${reviewId}/comment/${commentId}/like`, {})
    .then((res) => res.data);
