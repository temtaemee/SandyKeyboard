import axios from 'axios';

const PUBLIC_NOTICE = 'http://localhost/api/public/board/notice';
const USER_NOTICE = 'http://localhost/api/user/board/notice';
const PUBLIC_FAQ = 'http://localhost/api/public/board/faq';
const USER_FAQ = 'http://localhost/api/user/board/faq';

const getAuthConfig = () => {
  const token = localStorage.getItem('accessToken');
  console.log('토큰:', token); // ← 추가
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ─────────────────────────────────────────
// Notice API
// ─────────────────────────────────────────

// 목록 조회 (페이징)  GET /api/public/board/notice?page=0
// 응답: { content: [...], totalPages, totalElements, ... }
export const getNoticeList = (page = 0) =>
  axios.get(PUBLIC_NOTICE, { params: { page } }).then((res) => res.data);

// 상세 조회  GET /api/public/board/notice/{id}
export const getNoticeDetail = (id) =>
  axios.get(`${PUBLIC_NOTICE}/${id}`).then((res) => res.data);

// 등록  POST /api/user/board/notice  (multipart/form-data)
export const createNotice = (dto, fileList = []) => {
  console.log('createNotice 호출됨', dto, fileList); // ← 추가
  const formData = new FormData();
  formData.append(
    'dto',
    new Blob([JSON.stringify(dto)], { type: 'application/json' })
  );
  fileList.forEach((file) => formData.append('files', file));
  console.log('formData 생성 완료, 요청 시작'); // ← 추가
  return axios
    .post(USER_NOTICE, formData, getAuthConfig())
    .then((res) => {
      console.log('요청 성공:', res);
      return res.data;
    })
    .catch((err) => {
      console.error('요청 실패:', err);
      throw err;
    });
};

// 수정  PUT /api/user/board/notice/{id}  (JSON)
export const updateNotice = (id, dto) =>
  axios
    .put(`${USER_NOTICE}/${id}`, dto, getAuthConfig())
    .then((res) => res.data);

// 삭제  DELETE /api/user/board/notice/{id}
export const deleteNotice = (id) =>
  axios.delete(`${USER_NOTICE}/${id}`, getAuthConfig()).then((res) => res.data);

// ─────────────────────────────────────────
// FAQ API
// ─────────────────────────────────────────

// 목록 조회 (전체)  GET /api/public/board/faq
// FAQ는 프론트에서 페이징 처리
export const getFaqList = () => axios.get(PUBLIC_FAQ).then((res) => res.data);

// 등록  POST /api/user/board/faq  (JSON)
export const createFaq = (dto) =>
  axios.post(USER_FAQ, dto, getAuthConfig()).then((res) => res.data);

// 수정  PUT /api/user/board/faq/{id}  (JSON)
export const updateFaq = (id, dto) =>
  axios.put(`${USER_FAQ}/${id}`, dto, getAuthConfig()).then((res) => res.data);

// 삭제  DELETE /api/user/board/faq/{id}
export const deleteFaq = (id) =>
  axios.delete(`${USER_FAQ}/${id}`, getAuthConfig()).then((res) => res.data);
