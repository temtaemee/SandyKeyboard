import api from '../../../../../app/api/axios';

// ================================
// 공지사항 API 주소
// ================================

// 사용자(비회원 포함) 공지 조회용
const PUBLIC_NOTICE = '/public/notice';

// 관리자 공지 관리용
const ADMIN_NOTICE = '/admin/notice';

// 사용자 FAQ 조회용
const PUBLIC_FAQ = '/public/faq';

// 관리자 FAQ 관리용
const ADMIN_FAQ = '/admin/faq';

// ─────────────────────────────────────────
// Notice API (공지사항 API)
// ─────────────────────────────────────────

/**
 * 공지사항 목록 조회
 *
 * 사용 예시:
 * getNoticeList(0, "제목", "내용", "작성자")
 *
 * page     : 페이지 번호
 * title    : 제목 검색
 * content  : 내용 검색
 * writer   : 작성자 검색
 */
export const getNoticeList = (page = 0, title, content, writer) =>
  api
    .get(PUBLIC_NOTICE, { params: { page, title, content, writer } })
    .then((res) => res.data);

/**
 * 공지사항 상세 조회
 *
 * id : 공지사항 번호
 */
export const getNoticeDetail = (id) =>
  api.get(`${PUBLIC_NOTICE}/${id}`).then((res) => res.data);

/**
 * 공지사항 등록
 *
 * dto      : 제목/내용 등의 데이터
 * fileList : 첨부파일 배열
 *
 * multipart/form-data 방식 사용
 */
export const createNotice = (dto, fileList = []) => {
  const formData = new FormData();

  // dto를 JSON 형태로 전송
  formData.append(
    'dto',
    new Blob([JSON.stringify(dto)], { type: 'application/json' })
  );

  // 첨부파일 여러 개 추가
  fileList.forEach((file) => formData.append('files', file));

  // 관리자 전용 등록 API 호출
  return api.post(ADMIN_NOTICE, formData).then((res) => res.data);
};

/**
 * 공지사항 수정
 *
 * id  : 수정할 공지 번호
 * dto : 수정 데이터
 */
export const updateNotice = (id, dto) =>
  api.put(`${ADMIN_NOTICE}/${id}`, dto).then((res) => res.data);

/**
 * 공지사항 삭제
 *
 * id : 삭제할 공지 번호
 */
export const deleteNotice = (id) =>
  api.delete(`${ADMIN_NOTICE}/${id}`).then((res) => res.data);

// ─────────────────────────────────────────
// FAQ API (자주 묻는 질문 API)
// ─────────────────────────────────────────

/**
 * FAQ 목록 조회
 */
export const getFaqList = () => api.get(PUBLIC_FAQ).then((res) => res.data);

/**
 * FAQ 상세 조회
 *
 * id : FAQ 번호
 */
export const getFaqDetail = (id) =>
  api.get(`${PUBLIC_FAQ}/${id}`).then((res) => res.data);

/**
 * FAQ 등록
 *
 * dto : FAQ 제목/내용 데이터
 */
export const createFaq = (dto) =>
  api.post(ADMIN_FAQ, dto).then((res) => res.data);

/**
 * FAQ 수정
 *
 * id  : FAQ 번호
 * dto : 수정 데이터
 */
export const updateFaq = (id, dto) =>
  api.put(`${ADMIN_FAQ}/${id}`, dto).then((res) => res.data);

/**
 * FAQ 삭제
 *
 * id : 삭제할 FAQ 번호
 */
export const deleteFaq = (id) =>
  api.delete(`${ADMIN_FAQ}/${id}`).then((res) => res.data);
