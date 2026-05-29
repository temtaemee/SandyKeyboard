import { useState } from 'react';

/**
 * AdminReservationPage의 UI 로직(검색, 예약 필터링, 파트너사 목록 조회/편집/신규 등록 모달 상태)을 전담하는 커스텀 훅입니다.
 * 
 * @param {Object} params
 * @param {Array} params.partners - 파트너 기업 목록 데이터
 * @param {Function} params.addPartner - 파트너 등록 서버 디스패치 함수
 * @param {Function} params.updatePartner - 파트너 정보 수정 서버 디스패치 함수
 * @returns {Object} AdminReservationPage에서 사용할 UI 상태 및 핸들러 객체
 */
export default function useAdminReservationUI({
  partners,
  addPartner,
  updatePartner,
}) {
  // ─── 1. 예약 검색 및 필터 상태 ───
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // ─── 2. 파트너사 모달 및 검색 상태 ───
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [partnerSearch, setPartnerSearch] = useState('');

  // ─── 3. 파트너 신규 빠른 등록 폼 상태 ───
  const [companyName, setCompanyName] = useState('');
  const [companyBizNum, setCompanyBizNum] = useState('');

  // ─── 4. 파트너사 정보 인라인 수정 상태 ───
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // 모달 내 파트너사 검색 필터링 연산
  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(partnerSearch.toLowerCase())
  );

  // 파트너 신규 빠른 등록 처리
  const handleRegisterCompany = () => {
    if (companyName.trim()) {
      const today = new Date().toISOString().slice(0, 10);
      const newCompany = {
        id: Date.now(),
        name: companyName,
        businessNumber: companyBizNum.trim(),
        reservationCount: 0,
        status: 'active',
        iconBg: '#e2e8f0',
        iconColor: '#475569',
        partnerSince: today,
        updatedAt: today,
        created_at: new Date().toISOString(),
      };
      addPartner(newCompany);
      setCompanyName('');
      setCompanyBizNum('');
    }
  };

  // 파트너 정보 수정 모달 진입
  const startEdit = (company) => {
    setEditingId(company.id);
    setEditForm({
      name: company.name,
      businessNumber: company.businessNumber || '',
    });
  };

  // 파트너 정보 수정 모달 저장
  const saveEdit = (id) => {
    const today = new Date().toISOString().slice(0, 10);
    updatePartner(id, { ...editForm, updatedAt: today });
    setEditingId(null);
  };

  // 파트너 정보 수정 모달 취소
  const cancelEdit = () => setEditingId(null);

  return {
    // 예약 검색 및 필터링
    search,
    setSearch,
    statusFilter,
    setStatusFilter,

    // 파트너 모달 및 검색
    partnerModalOpen,
    setPartnerModalOpen,
    partnerSearch,
    setPartnerSearch,
    filteredPartners,

    // 파트너 신규 빠른 등록
    companyName,
    setCompanyName,
    companyBizNum,
    setCompanyBizNum,
    handleRegisterCompany,

    // 파트너 인라인 편집
    editingId,
    editForm,
    setEditForm,
    startEdit,
    saveEdit,
    cancelEdit,
  };
}
