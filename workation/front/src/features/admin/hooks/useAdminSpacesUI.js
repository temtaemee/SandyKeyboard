import { useState } from 'react';

/**
 * AdminSpacesPage의 UI 로직(검색 및 노출 필터링, 노출 상태 변경 확인 모달, 승인 대기 목록 관리 및 객실(Stay) 비동기 조회 모달)을 전담하는 커스텀 훅입니다.
 * 
 * @param {Object} params
 * @param {Array} params.spaces - 전체 운영 중인 숙소 리스트
 * @param {Array} params.pendingSpaces - 승인 대기 숙소 리스트
 * @param {Array} params.rejectedSpaces - 거절된 숙소 리스트
 * @param {Function} params.refetch - 숙소 리스트 재조회 API trigger 함수
 * @param {Function} params.approveSpaces - 숙소 승인 서버 디스패치 함수
 * @param {Function} params.rejectSpaces - 숙소 거절 서버 디스패치 함수
 * @param {Function} params.getStaysBySpaceId - 특정 숙소의 객실(Stay) 리스트를 가져오는 API 함수
 * @param {Function} params.changeSpaceVisible - 특정 숙소의 공개여부(visibleYn)를 토글 변경하는 API 함수
 * @returns {Object} AdminSpacesPage에서 사용할 UI 상태 및 핸들러 객체
 */
export default function useAdminSpacesUI({
  spaces,
  pendingSpaces,
  rejectedSpaces,
  refetch,
  approveSpaces,
  rejectSpaces,
  optimisticToggleVisible,
  getStaysBySpaceId,
  changeSpaceVisible,
}) {
  // ─── 1. 테이블 검색 및 공개 상태 필터 ───
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');

  // 숙소 이름 및 공개여부 기반 필터링 연산
  const filteredSpaces = spaces.filter((space) => {
    if (space['del_yn'] === 'Y') return false;
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === '전체' ? true :
      statusFilter === '공개' ? space.visibleYn === 'Y' :
      space.visibleYn === 'N';
    return matchesSearch && matchesStatus;
  });

  // ─── 2. 공개 / 비공개(중지) 여부 확인 모달 상태 ───
  const [visibleConfirmTarget, setVisibleConfirmTarget] = useState(null); // null | target 객체

  // 토글 스위치 클릭 시 확인 모달 띄우기
  const handleVisibleClick = (space) => {
    setVisibleConfirmTarget({
      id: space.id,
      name: space.name,
      willHide: space.visibleYn === 'Y',
    });
  };

  // 공개 토글 최종 변경 확인 처리 핸들러
  const handleVisibleConfirm = async () => {
    if (!visibleConfirmTarget) return;
    const { id, willHide } = visibleConfirmTarget;
    const nextVisible = willHide ? 'N' : 'Y';

    // 낙관적 업데이트: API 완료 전에 UI 즉시 반영
    optimisticToggleVisible(id, nextVisible);
    setVisibleConfirmTarget(null);

    try {
      await changeSpaceVisible(id, nextVisible);
    } catch (err) {
      // 실패 시 원래 상태로 롤백
      console.error('노출 상태 변경 실패:', err);
      optimisticToggleVisible(id, willHide ? 'Y' : 'N');
    }
  };

  // ─── 3. 숙소 등록 승인/거절 모달 & 다중 체크박스 선택 상태 ───
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('pending'); // 'pending' | 'rejected'
  const [selectedIds, setSelectedIds] = useState([]);

  // 체크박스 토글 선택 핸들러
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 선택된 숙소 승인 처리
  const handleApproveSelected = () => {
    approveSpaces(selectedIds, modalTab);
    setSelectedIds([]);
  };

  // 선택된 숙소 거절 처리
  const handleRejectSelected = () => {
    if (modalTab !== 'pending') return;
    rejectSpaces(selectedIds);
    setSelectedIds([]);
  };

  // 현재 활성화된 모달 탭에 따른 대기/거절 리스트 매핑
  const currentModalList = modalTab === 'pending' ? pendingSpaces : rejectedSpaces;

  // ─── 4. 객실(Stay) 비동기 조회 모달 상태 ───
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [spaceStays, setSpaceStays] = useState([]);
  const [stayLoading, setStayLoading] = useState(false);
  const [isStayModalOpen, setIsStayModalOpen] = useState(false);

  // 숙소 행(Row) 클릭 시 객실 목록 로딩 및 모달 열기 핸들러
  const handleSpaceClick = async (space) => {
    setSelectedSpace(space);
    setIsStayModalOpen(true);
    setStayLoading(true);
    try {
      const resp = await getStaysBySpaceId(space.id);
      setSpaceStays(resp.data);
    } catch (err) {
      console.error(err);
      setSpaceStays([]);
    } finally {
      setStayLoading(false);
    }
  };

  return {
    // 검색 및 노출 상태 필터
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    spaces: filteredSpaces,

    // 노출 여부 토글 모달
    visibleConfirmTarget,
    setVisibleConfirmTarget,
    handleVisibleClick,
    handleVisibleConfirm,

    // 승인/거절 모달 및 체크박스 제어
    isModalOpen,
    setIsModalOpen,
    modalTab,
    setModalTab,
    selectedIds,
    setSelectedIds,
    toggleSelect,
    handleApproveSelected,
    handleRejectSelected,
    currentModalList,

    // Stay 비동기 조회 모달
    selectedSpace,
    spaceStays,
    stayLoading,
    isStayModalOpen,
    setIsStayModalOpen,
    handleSpaceClick,
  };
}
