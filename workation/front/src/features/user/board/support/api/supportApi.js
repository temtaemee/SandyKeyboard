import api from '../../../../../app/api/axios';

const PUBLIC_NOTICE = '/public/notice';
const ADMIN_NOTICE = '/admin/notice';
const PUBLIC_FAQ = '/public/board/faq';
const USER_FAQ = '/user/board/faq';

// ─────────────────────────────────────────
// Notice API
// ─────────────────────────────────────────

// 목록 조회 (페이징 + 검색)
// GET /api/public/notice?page=0&title=제목&content=내용&writer=작성자
export const getNoticeList = (page = 0, title, content, writer) =>
  api
    .get(PUBLIC_NOTICE, { params: { page, title, content, writer } })
    .then((res) => res.data);

// 상세 조회
// GET /api/public/notice/{id}
export const getNoticeDetail = (id) =>
  api.get(`${PUBLIC_NOTICE}/${id}`).then((res) => res.data);

// 등록
// POST /api/admin/notice
export const createNotice = (dto, fileList = []) => {
  const formData = new FormData();
  formData.append(
    'dto',
    new Blob([JSON.stringify(dto)], { type: 'application/json' })
  );
  fileList.forEach((file) => formData.append('files', file));
  return api.post(ADMIN_NOTICE, formData).then((res) => res.data);
};

// 수정
// PUT /api/admin/notice/{id}
export const updateNotice = (id, dto) =>
  api.put(`${ADMIN_NOTICE}/${id}`, dto).then((res) => res.data);

// 삭제
// DELETE /api/admin/notice/{id}
export const deleteNotice = (id) =>
  api.delete(`${ADMIN_NOTICE}/${id}`).then((res) => res.data);

// ─────────────────────────────────────────
// FAQ API
// ─────────────────────────────────────────

// 목록 조회
// GET /api/public/board/faq
export const getFaqList = () => api.get(PUBLIC_FAQ).then((res) => res.data);

// 등록
// POST /api/user/board/faq
export const createFaq = (dto) =>
  api.post(USER_FAQ, dto).then((res) => res.data);

// 수정
// PUT /api/user/board/faq/{id}
export const updateFaq = (id, dto) =>
  api.put(`${USER_FAQ}/${id}`, dto).then((res) => res.data);

// 삭제
// DELETE /api/user/board/faq/{id}
export const deleteFaq = (id) =>
  api.delete(`${USER_FAQ}/${id}`).then((res) => res.data);
