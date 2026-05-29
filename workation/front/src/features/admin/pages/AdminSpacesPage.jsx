// src/features/admin/pages/AdminSpacesPage.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Home, CheckCircle, AlertTriangle, EyeOff, X } from 'lucide-react';
import AdminSearchInput from '../components/common/AdminSearchInput';
import usePagination from '../hooks/usePagination';
import AdminPagination from '../components/common/AdminPagination';
import ConfirmModal from '../components/common/ConfirmModal';
import Toggle from '../components/common/Toggle';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseBtn,
} from '../components/common/AdminModal.styles';
import useAdminSpaces from '../hooks/useAdminSpaces';
import useAdminSpacesUI from '../hooks/useAdminSpacesUI';
import { getStaysBySpaceId, changeSpaceVisible, getAdminSpaces } from '../api/adminSpacesApi';


export default function AdminSpacesPage() {
  const { currentPage, goToPage } = usePagination();

  const [deletedSpaces, setDeletedSpaces] = useState([]);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);

  useEffect(() => {
    getAdminSpaces({ delYn: 'Y' })
      .then(res => setDeletedSpaces(Array.isArray(res.data) ? res.data : []))
      .catch(() => setDeletedSpaces([]));
  }, []);

  const {
    spaces,
    pendingSpaces,
    rejectedSpaces,
    loading,
    refetch,
    approveSpaces,
    rejectSpaces,
    optimisticToggleVisible,
  } = useAdminSpaces();

  // 통합 UI 훅 도입으로 모달, 비동기 Stay 목록, 다중 선택 등의 useState 제거 및 비즈니스 로직 격리
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    spaces: filteredSpaces,
    visibleConfirmTarget,
    setVisibleConfirmTarget,
    handleVisibleClick,
    handleVisibleConfirm,
    isModalOpen,
    setIsModalOpen,
    modalTab,
    setModalTab,
    selectedIds,
    toggleSelect,
    handleApproveSelected,
    handleRejectSelected,
    currentModalList,
    selectedSpace,
    spaceStays,
    stayLoading,
    isStayModalOpen,
    setIsStayModalOpen,
    handleSpaceClick,
  } = useAdminSpacesUI({
    spaces,
    pendingSpaces,
    rejectedSpaces,
    refetch,
    approveSpaces,
    rejectSpaces,
    optimisticToggleVisible,
    getStaysBySpaceId,
    changeSpaceVisible,
  });

  return (
    <PageWrapper>
      {/* ── 페이지 헤더 ── */}
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>숙소 관리</PageTitle>
          <PageSub>등록된 숙소를 관리하고 새로운 상품을 추가합니다.</PageSub>
        </PageTitleGroup>
      </PageHeader>

      {/* ── 통계 카드 3개 ── */}
      <StatsSection>
        <StatCard>
          <StatCardTop>
            <StatIconWrap $bg="rgba(34,197,94,0.1)" $color="#16a34a">
              <SpaceIcon />
            </StatIconWrap>
          </StatCardTop>
          <StatLabel>전체 숙소 수</StatLabel>
          <StatValue>{spaces.filter(s => s['del_yn'] === 'N').length.toLocaleString()}</StatValue>
        </StatCard>

        <StatCard style={{ cursor: 'pointer' }} onClick={() => setIsDeletedModalOpen(true)}>
          <StatCardTop>
            <StatIconWrap $bg="rgba(59,130,246,0.1)" $color="#2563eb">
              <CheckCircleIcon />
            </StatIconWrap>
          </StatCardTop>
          <StatLabel>비 운영 숙소</StatLabel>
          <StatValue>{deletedSpaces.length.toLocaleString()}</StatValue>
        </StatCard>

        <StatCard style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(true)}>
          <StatCardTop>
            <StatIconWrap $bg="rgba(249,115,22,0.1)" $color="#ea580c">
              <AlertIcon />
            </StatIconWrap>
          </StatCardTop>
          <StatLabel>승인 대기 중</StatLabel>
          <StatValue>{pendingSpaces.length}</StatValue>
        </StatCard>
      </StatsSection>

      {/* ── 테이블 섹션 ── */}
      <TableSection>
        <Toolbar>
          <StatusFilterGroup>
            {['전체', '공개', '비공개'].map((s) => (
              <StatusFilterBtn
                key={s}
                $active={statusFilter === s}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </StatusFilterBtn>
            ))}
          </StatusFilterGroup>
          <AdminSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="숙소 이름 검색..."
          />
        </Toolbar>

        <Table>
          <THead>
            <TR>
              <TH $width="300px">숙소 이름</TH>
              <TH $width="180px">판매자</TH>
              <TH $width="140px">주소</TH>
              <TH $width="110px">등록일</TH>
              <TH $width="100px">현재상태</TH>
            </TR>
          </THead>
          <TBody>
            {filteredSpaces.length === 0 ? (
                <TR><TD colSpan={5}><EmptyTableState>검색 결과가 없습니다.</EmptyTableState></TD></TR>
            ) : filteredSpaces.map((space) => {
              const hidden = space.visibleYn === 'N';
              return (
                <TR key={space.id} $hoverable style={{ cursor: 'pointer' }} onClick={() => handleSpaceClick(space)}>
                  <TD>
                    <SpaceCell>
                      <SpaceThumbnail src={space.thumbnailUrl} alt={space.name} $blinded={hidden} />
                      <SpaceInfo>
                        <SpaceName $blinded={hidden}>{space.name}</SpaceName>
                        <SpaceLocation>{space.address1}</SpaceLocation>
                      </SpaceInfo>
                    </SpaceCell>
                  </TD>
                  <TD><SellerText>{space.sellerName ?? space.sellerUsername ?? '-'}</SellerText></TD>
                  <TD><SellerText>{space.area}</SellerText></TD>
                  <TD><DateText>{space.createdAt?.slice(0, 10).replace(/-/g, '.')}</DateText></TD>
                  <TD onClick={e => e.stopPropagation()}>
                    <Toggle
                      on={hidden}
                      onClick={() => handleVisibleClick(space)}
                      onLabel="중지"
                      offLabel="공개"
                      labelWidth="40px"
                    />
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>

        <TableFooter>
          <AdminPagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredSpaces.length / 10) || 1}
            onPageChange={goToPage}
          />
        </TableFooter>
      </TableSection>

      {/* ── 노출 여부 확인 모달 ── */}
      <ConfirmModal
        isOpen={visibleConfirmTarget !== null}
        onClose={() => setVisibleConfirmTarget(null)}
        onConfirm={handleVisibleConfirm}
        title={visibleConfirmTarget?.willHide ? '숙소를 비공개 처리하시겠습니까?' : '숙소를 공개하시겠습니까?'}
        description={
          visibleConfirmTarget
            ? visibleConfirmTarget.willHide
              ? `${visibleConfirmTarget.name} 숙소가 사용자에게 노출되지 않습니다.`
              : `${visibleConfirmTarget.name} 숙소가 다시 공개됩니다.`
            : ''
        }
        isDanger={visibleConfirmTarget?.willHide}
        confirmText={visibleConfirmTarget?.willHide ? '비공개' : '공개하기'}
        icon={<EyeOff size={24} color={visibleConfirmTarget?.willHide ? '#ef4444' : '#64748b'} />}
      />

      {/* ── Stay 목록 모달 ── */}
      {isStayModalOpen && selectedSpace && (
        <ModalOverlay onClick={() => setIsStayModalOpen(false)}>
          <ModalContent $width="600px" onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{selectedSpace.name} — 객실 목록</ModalTitle>
              <ModalCloseBtn onClick={() => setIsStayModalOpen(false)}>
                <X size={20} />
              </ModalCloseBtn>
            </ModalHeader>
            <ModalBody>
              {stayLoading ? (
                <EmptyState>불러오는 중...</EmptyState>
              ) : spaceStays.length === 0 ? (
                <EmptyState>등록된 객실이 없습니다.</EmptyState>
              ) : (
                <StayList>
                  {spaceStays.map(stay => {
                    const prices = [stay.monPrice, stay.tuePrice, stay.wedPrice, stay.thuPrice, stay.friPrice, stay.satPrice, stay.sunPrice].filter(Boolean);
                    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
                    return (
                      <StayItem key={stay.id}>
                        <StayItemInfo>
                          <StayItemName>{stay.name}</StayItemName>
                          <StayItemMeta>기준 {stay.capacity}인 / 최대 {stay.maxCapa}인</StayItemMeta>
                        </StayItemInfo>
                        <StayItemPrice>최저 ₩{minPrice.toLocaleString()}</StayItemPrice>
                        <StayBadge $visible={stay.visibleYn === 'Y'}>
                          {stay.visibleYn === 'Y' ? '공개' : '비공개'}
                        </StayBadge>
                      </StayItem>
                    );
                  })}
                </StayList>
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ── 비 운영 숙소 모달 ── */}
      {isDeletedModalOpen && (
        <ModalOverlay onClick={() => setIsDeletedModalOpen(false)}>
          <ModalContent $width="600px" onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>비 운영 숙소 목록</ModalTitle>
              <ModalCloseBtn onClick={() => setIsDeletedModalOpen(false)}>
                <X size={20} />
              </ModalCloseBtn>
            </ModalHeader>
            <ModalBody>
              {deletedSpaces.length === 0 ? (
                <EmptyState>비 운영 숙소가 없습니다.</EmptyState>
              ) : (
                <DeletedSpaceList>
                  {deletedSpaces.map(space => (
                    <DeletedSpaceItem key={space.id}>
                      <SpaceThumbnail src={space.thumbnailUrl} alt={space.name} $blinded />
                      <SpaceInfo>
                        <SpaceName $blinded>{space.name}</SpaceName>
                        <SpaceLocation>{space.area} · {space.address1}</SpaceLocation>
                      </SpaceInfo>
                      <DeletedBadge>비운영</DeletedBadge>
                    </DeletedSpaceItem>
                  ))}
                </DeletedSpaceList>
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ── 승인/거절 모달 ── */}
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent $width="500px" onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>숙소 승인 관리</ModalTitle>
              <ModalCloseBtn onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </ModalCloseBtn>
            </ModalHeader>
            <ModalTabs>
              <ModalTab 
                $active={modalTab === 'pending'} 
                onClick={() => { setModalTab('pending'); setSelectedIds([]); }}
              >
                승인 대기 리스트
              </ModalTab>
              <ModalTab 
                $active={modalTab === 'rejected'} 
                onClick={() => { setModalTab('rejected'); setSelectedIds([]); }}
              >
                거절 리스트
              </ModalTab>
            </ModalTabs>
            <ModalBody>
              {currentModalList.length === 0 ? (
                <EmptyState>해당하는 숙소가 없습니다.</EmptyState>
              ) : (
                <ApprovalList>
                  {currentModalList.map(space => (
                    <ApprovalItem key={space.id}>
                      <Checkbox 
                        type="checkbox" 
                        checked={selectedIds.includes(space.id)}
                        onChange={() => toggleSelect(space.id)}
                      />
                      <SpaceThumbnail src={space.thumbnail} alt={space.name} $blinded={false} />
                      <SpaceInfo>
                        <SpaceName $blinded={false}>{space.name}</SpaceName>
                        <SpaceLocation>{space.location} · {space.seller}</SpaceLocation>
                      </SpaceInfo>
                    </ApprovalItem>
                  ))}
                </ApprovalList>
              )}
            </ModalBody>
            <ModalFooter>
              <StatusText>{selectedIds.length}개 선택됨</StatusText>
              <ButtonGroup>
                {modalTab === 'pending' && (
                  <>
                    <RejectBtn 
                      onClick={handleRejectSelected}
                      disabled={selectedIds.length === 0}
                    >
                      선택 거절
                    </RejectBtn>
                    <ApproveBtn 
                      onClick={handleApproveSelected}
                      disabled={selectedIds.length === 0}
                    >
                      선택 승인
                    </ApproveBtn>
                  </>
                )}
                {modalTab === 'rejected' && (
                  <ApproveBtn 
                    onClick={handleApproveSelected}
                    disabled={selectedIds.length === 0}
                  >
                    선택 승인 (재검토)
                  </ApproveBtn>
                )}
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
}

/* ── Icon Components ── */
function SpaceIcon() { return <Home size={20} />; }
function CheckCircleIcon() { return <CheckCircle size={20} />; }
function AlertIcon() { return <AlertTriangle size={20} />; }

/* ── Styled Components ── */

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const PageTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: #0d1c2e;
  letter-spacing: -0.24px;
  line-height: 1.33;
`;

const PageSub = styled.p`
  font-size: 14px;
  color: #64748b;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: transform 0.2s;
  &:hover { transform: translateY(-2px); }
`;

const StatCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const StatIconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatLabel = styled.p`
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.p`
  font-size: 32px;
  font-weight: 700;
  color: #0d1c2e;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.5px;
  line-height: 1.2;
`;

const TableSection = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
`;

const StatusFilterGroup = styled.div`
  display: flex;
  gap: 4px;
`;

const StatusFilterBtn = styled.button`
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  border: 1px solid ${({ $active }) => ($active ? '#244c54' : '#e2e8f0')};
  background: ${({ $active }) => ($active ? '#244c54' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#475569')};
  transition: all 0.15s;
  &:hover {
    background: ${({ $active }) => ($active ? '#1d3d44' : '#f8fafc')};
    border-color: ${({ $active }) => ($active ? '#1d3d44' : '#cbd5e1')};
  }
`;

const TotalText = styled.p`
  font-size: 12px;
  color: #94a3b8;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const THead = styled.thead`
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
`;

const TBody = styled.tbody``;

const TR = styled.tr`
  border-top: ${({ $hoverable }) => ($hoverable ? '1px solid #f1f5f9' : 'none')};
  transition: background 0.1s;
  &:hover {
    background: ${({ $hoverable }) => ($hoverable ? '#fafbfc' : 'transparent')};
  }
`;

const TH = styled.th`
  padding: 11px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.3px;
  width: ${({ $width }) => $width || 'auto'};
  white-space: nowrap;
`;

const TD = styled.td`
  padding: 14px 20px;
  vertical-align: middle;
`;

const SpaceCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SpaceThumbnail = styled.img`
  width: 56px;
  height: 42px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  background: #f1f5f9;
  opacity: ${({ $blinded }) => ($blinded ? 0.35 : 1)};
  transition: opacity 0.2s;
`;

const SpaceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SpaceName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $blinded }) => ($blinded ? '#94a3b8' : '#0d1c2e')};
  transition: color 0.2s;
`;

const SpaceLocation = styled.span`
  font-size: 11px;
  color: #94a3b8;
`;

const SellerText = styled.span`
  font-size: 13px;
  color: #475569;
`;

const PriceText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #0d1c2e;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const DateText = styled.span`
  font-size: 12px;
  color: #94a3b8;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

// Toggle 스타일은 components/common/Toggle.jsx 에서 관리

const EmptyTableState = styled.div`
  padding: 48px 0;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
`;

const TableFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
`;

/* ── Modal: ModalOverlay / ModalContent / ModalHeader / ModalCloseBtn 은
   components/common/AdminModal.styles.js 에서 공통 import ── */

// 이 모달에서만 쓰는 타이틀 스타일
const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #0d1c2e;
`;

const ModalTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const ModalTab = styled.button`
  flex: 1;
  padding: 14px 0;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? '#2563eb' : '#64748b')};
  border-bottom: 2px solid ${({ $active }) => ($active ? '#2563eb' : 'transparent')};
  transition: all 0.2s;
  &:hover {
    color: ${({ $active }) => ($active ? '#2563eb' : '#334155')};
  }
`;

const ModalBody = styled.div`
  padding: 20px 24px;
  max-height: 400px;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #94a3b8;
  font-size: 14px;
`;

const ApprovalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ApprovalItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: background 0.2s;
  &:hover { background: #f8fafc; }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #2563eb;
`;

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const StatusText = styled.span`
  font-size: 13px;
  color: #64748b;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionBtn = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RejectBtn = styled(ActionBtn)`
  background: white;
  color: #ef4444;
  border: 1px solid #ef4444;
  &:not(:disabled):hover {
    background: #fef2f2;
  }
`;

const ApproveBtn = styled(ActionBtn)`
  background: #2563eb;
  color: white;
  border: 1px solid #2563eb;
  &:not(:disabled):hover {
    background: #1d4ed8;
  }
`;

/* ── Stay 모달 전용 ── */
const StayList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StayItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  &:hover { background: #f8fafc; }
`;

const StayItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const StayItemName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #0d1c2e;
`;

const StayItemMeta = styled.span`
  font-size: 12px;
  color: #94a3b8;
`;

const StayItemPrice = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #0d1c2e;
  font-family: 'Plus Jakarta Sans', sans-serif;
  white-space: nowrap;
`;

const StayBadge = styled.span`
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $visible }) => ($visible ? 'rgba(34,197,94,0.1)' : 'rgba(148,163,184,0.15)')};
  color: ${({ $visible }) => ($visible ? '#16a34a' : '#64748b')};
  white-space: nowrap;
`;

const DeletedSpaceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DeletedSpaceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fafbfc;
`;

const DeletedBadge = styled.span`
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: rgba(239,68,68,0.1);
  color: #dc2626;
  white-space: nowrap;
  flex-shrink: 0;
`;
