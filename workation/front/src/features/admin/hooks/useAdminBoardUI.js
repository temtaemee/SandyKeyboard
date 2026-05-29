import { useState } from 'react';

const COUPON_STATUS_MAP = { 활성: 'active', 소진: 'exhausted', 삭제: 'deleted' };

/**
 * AdminBoardPage의 UI 로직(검색, 필터링, 다양한 모달 창 제어, 폼 입력)을 전담하는 커스텀 훅입니다.
 * 
 * @param {Object} params
 * @param {Array} params.tabPosts - 현재 탭의 게시글 목록
 * @param {string} params.activeTab - 현재 선택된 활성 탭명
 * @param {Function} params.updatePost - 게시글 정보를 업데이트하는 서버 디스패치 함수
 * @param {Function} params.dispatchDeletePost - 게시글을 삭제하는 서버 디스패치 함수
 * @returns {Object} AdminBoardPage에서 사용할 UI 상태 및 핸들러 객체
 */
export default function useAdminBoardUI({
  tabPosts,
  activeTab,
  updatePost,
  dispatchDeletePost,
  dispatchSoftDeleteCoupon,
}) {
  // ─── 1. 검색 및 필터 상태 ───
  const [searchQuery, setSearchQuery] = useState('');
  const [couponFilter, setCouponFilter] = useState('전체');

  // 검색 및 쿠폰 상태 필터링 연산
  const filteredPosts = tabPosts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab !== '쿠폰') return matchSearch;
    // 전체 필터: 삭제된 쿠폰은 제외
    if (couponFilter === '전체') return matchSearch && p.status !== 'deleted';
    return matchSearch && p.status === COUPON_STATUS_MAP[couponFilter];
  });

  // 검색 및 쿠폰 필터 상태 초기화
  const resetFilters = () => {
    setSearchQuery('');
    setCouponFilter('전체');
  };

  // ─── 2. 신규 등록 / 수정 모달 & 폼 상태 ───
  const [registerModal, setRegisterModal] = useState(null); // null | tabName string
  const [editingPost, setEditingPost] = useState(null);     // 현재 수정 중인 post 객체
  const [formData, setFormData] = useState({});              // 작성 중인 폼 입력 값 객체

  // 등록 모달 열기
  const openRegisterModal = (type) => {
    setRegisterModal(type);
    setEditingPost(null);
    setFormData({});
  };

  // 수정 모달 열기 (상세 모달은 자동으로 닫힘)
  const openEditModal = (post) => {
    setDetailPost(null);
    setRegisterModal(activeTab);
    setEditingPost(post);
    if (activeTab === '쿠폰') {
      setFormData({
        name: post.couponName ?? post.title,
        discountRate: post.discountRate ?? '',
        quantity: post.remainingQty ?? '',
        validDays: post.validDays ?? '',
      });
    } else {
      setFormData({ title: post.title, content: post.content || '' });
    }
  };

  // 등록/수정 모달 닫기
  const closeRegisterModal = () => {
    setRegisterModal(null);
    setEditingPost(null);
    setFormData({});
  };

  // 폼 입력 필드 변경 핸들러
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 등록/수정 완료 제출 핸들러
  const handleRegisterSubmit = () => {
    if (editingPost) {
      updatePost(editingPost.id, { title: formData.title || editingPost.title });
    }
    closeRegisterModal();
  };

  // ─── 3. 상세보기 모달 상태 ───
  const [detailPost, setDetailPost] = useState(null); // null | post 객체

  // ─── 4. 삭제 확인 모달 상태 ───
  const [deleteTarget, setDeleteTarget] = useState(null); // null | post 객체

  // 삭제 확인 완료 제출 핸들러
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (activeTab === '쿠폰') {
      dispatchSoftDeleteCoupon(deleteTarget.id);
    } else {
      dispatchDeletePost(deleteTarget.id);
    }
    setDeleteTarget(null);
    setDetailPost(null);
  };

  return {
    // 1. 검색 및 필터
    searchQuery,
    setSearchQuery,
    couponFilter,
    setCouponFilter,
    posts: filteredPosts,
    resetFilters,

    // 2. 신규 등록 및 수정
    registerModal,
    editingPost,
    formData,
    openRegisterModal,
    openEditModal,
    closeRegisterModal,
    handleFormChange,
    handleRegisterSubmit,

    // 3. 상세보기
    detailPost,
    setDetailPost,

    // 4. 삭제 확인
    deleteTarget,
    setDeleteTarget,
    handleDeleteConfirm,
  };
}
