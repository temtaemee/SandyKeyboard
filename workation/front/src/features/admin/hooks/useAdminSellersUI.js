import { useState } from 'react';

/**
 * AdminSellersPage의 UI 로직(고객/판매자 뷰 전환, 검색 및 카테고리 필터링, 계정 정지 모달, 상세 쿠폰 발급 패널)을 전담하는 커스텀 훅입니다.
 * 
 * @param {Object} params
 * @param {Array} params.sellers - 판매자 리스트
 * @param {Array} params.customers - 고객 리스트
 * @param {Object} params.sellerSuspended - 판매자 계정 정지 여부 임시 캐시 객체
 * @param {Object} params.customerSuspended - 고객 계정 정지 여부 임시 캐시 객체
 * @param {Function} params.suspendSeller - 판매자 정지 요청 서버 디스패치 함수
 * @param {Function} params.suspendCustomer - 고객 정지 요청 서버 디스패치 함수
 * @param {Function} params.addCoupon - 고객 쿠폰 추가 서버 디스패치 함수
 * @param {Function} params.deleteCoupon - 고객 쿠폰 삭제 서버 디스패치 함수
 * @param {Function} params.resetPage - 페이지네이션 페이지 번호 초기화 함수
 * @returns {Object} AdminSellersPage에서 사용할 UI 상태 및 핸들러 객체
 */
export default function useAdminSellersUI({
  sellers,
  customers,
  sellerSuspended,
  customerSuspended,
  suspendSeller,
  suspendCustomer,
  addCoupon,
  deleteCoupon,
  resetPage,
  fetchMemberCoupons,
  fetchIssuableCoupons,
  issuableCoupons,
}) {
  // ─── 1. 기본 뷰/필터/검색어 상태 ───
  const [view, setView] = useState('customer'); // 'customer' | 'seller'
  const [filter, setFilter] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  // 뷰 전환 핸들러 (뷰 전환 시 필터, 검색어, 페이징 초기화)
  const handleViewChange = (v) => {
    setView(v);
    setFilter('전체');
    setSearchQuery('');
    resetPage();
  };

  // ─── 2. 계정 활성/비활성(정지) 토글 및 모달 ───
  const [confirmTarget, setConfirmTarget] = useState(null); // null | confirmTarget 객체

  // 특정 판매자/고객이 정지(stopped) 상태인지 확인하는 헬퍼 함수
  const isSellerSuspended = (s) =>
    sellerSuspended[s.id] ?? s.status === 'stopped';
  const isCustomerSuspended = (c) =>
    customerSuspended[c.id] ?? c.status === 'stopped';

  // 정지 토글 클릭 핸들러
  const handleToggleClick = (item, isCurrent) => {
    setConfirmTarget({
      id: item.id,
      name: item.name,
      willSuspend: !isCurrent,
      view,
    });
  };

  // 정지 확인 처리 핸들러
  const handleConfirm = () => {
    if (!confirmTarget) return;
    if (confirmTarget.view === 'seller') {
      suspendSeller(confirmTarget.id, confirmTarget.willSuspend);
    } else {
      suspendCustomer(confirmTarget.id, confirmTarget.willSuspend);
    }
    setConfirmTarget(null);
  };

  // ─── 3. 고객 상세 모달 및 쿠폰 발급/삭제 상태 ───
  const [selectedCustomer, setSelectedCustomer] = useState(null); // null | customer 객체
  const [showIssuePanel, setShowIssuePanel] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // 고객 상세 모달 열기 (API 조회 포함)
  const handleOpenCustomerDetail = async (customer) => {
    setSelectedCustomer(customer);
    setShowIssuePanel(false);
    setSelectedTemplate(null);
    const [, coupons] = await Promise.all([
      fetchMemberCoupons(customer.id, customer.username || customer.name),
      fetchIssuableCoupons(),
    ]);
    if (coupons && coupons.length > 0) {
      setSelectedTemplate(String(coupons[0].id));
    }
  };

  // 고객 상세 모달 닫기
  const handleCloseCustomerModal = () => {
    setSelectedCustomer(null);
    setShowIssuePanel(false);
    setSelectedTemplate(null);
  };

  // 쿠폰 삭제 핸들러
  const handleDeleteCoupon = async (customerId, couponId) => {
    try {
      await deleteCoupon(customerId, selectedCustomer.username || selectedCustomer.name, couponId);
    } catch (err) {
      alert('쿠폰 삭제에 실패했습니다.');
    }
  };

  // 신규 쿠폰 직접 발급 핸들러
  const handleIssueCoupon = async () => {
    if (!selectedCustomer || !selectedTemplate) return;
    try {
      await addCoupon(selectedCustomer.id, selectedCustomer.username || selectedCustomer.name, selectedTemplate);
      setShowIssuePanel(false);
      setSelectedTemplate(null);
    } catch (err) {
      alert('쿠폰 발급에 실패했습니다.');
    }
  };

  return {
    // 뷰 및 검색/필터
    view,
    setView,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    handleViewChange,

    // 정지/활성화 확인 모달
    confirmTarget,
    setConfirmTarget,
    isSellerSuspended,
    isCustomerSuspended,
    handleToggleClick,
    handleConfirm,

    // 고객 모달 및 쿠폰 발급
    selectedCustomer,
    setSelectedCustomer,
    handleOpenCustomerDetail,
    showIssuePanel,
    setShowIssuePanel,
    selectedTemplate,
    setSelectedTemplate,
    handleCloseCustomerModal,
    handleDeleteCoupon,
    handleIssueCoupon,
  };
}
