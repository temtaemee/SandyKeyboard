// src/features/admin/pages/AdminSpacesPage.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { Home, CheckCircle, AlertTriangle, Search, EyeOff, X } from 'lucide-react';
import {
  SPACES_TOTAL,
  SPACES_TOTAL_PAGES,
  SPACES_LIST,
  PENDING_SPACES,
} from '../data/adminSpacesData';
import usePagination from '../hooks/usePagination';
import AdminPagination from '../components/common/AdminPagination';
import ConfirmModal from '../components/common/ConfirmModal';


export default function AdminSpacesPage() {
  const { currentPage, goToPage } = usePagination();
  const [spaces, setSpaces] = useState(SPACES_LIST);
  const [blindedIds, setBlindedIds] = useState({});
  const [blindConfirmTarget, setBlindConfirmTarget] = useState(null);

  // 승인 대기 / 거절 관련 상태
  const [pendingSpaces, setPendingSpaces] = useState(PENDING_SPACES);
  const [rejectedSpaces, setRejectedSpaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('pending'); // 'pending' | 'rejected'
  const [selectedIds, setSelectedIds] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');

  const isBlinded = (space) => blindedIds[space.id] ?? false;

  const filteredSpaces = spaces.filter((space) => {
    const matchesSearch = space.name.toLowerCase().includes(searchQuery.toLowerCase());
    const blinded = isBlinded(space);
    const matchesStatus =
      statusFilter === '전체' ? true :
      statusFilter === '공개' ? !blinded :
      blinded;
    return matchesSearch && matchesStatus;
  });

  const handleBlindClick = (space) => {
    setBlindConfirmTarget({ id: space.id, name: space.name, willBlind: !isBlinded(space) });
  };

  const handleBlindConfirm = () => {
    if (!blindConfirmTarget) return;
    setBlindedIds((prev) => ({ ...prev, [blindConfirmTarget.id]: blindConfirmTarget.willBlind }));
    setBlindConfirmTarget(null);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleApproveSelected = () => {
    const listToProcess = modalTab === 'pending' ? pendingSpaces : rejectedSpaces;
    const toApprove = listToProcess.filter(s => selectedIds.includes(s.id));
    
    // 승인된 항목들을 메인 리스트로 이동
    setSpaces(prev => [...toApprove.map(s => ({ ...s, status: 'active' })), ...prev]);
    
    // 기존 리스트에서 제거
    if (modalTab === 'pending') {
      setPendingSpaces(prev => prev.filter(s => !selectedIds.includes(s.id)));
    } else {
      setRejectedSpaces(prev => prev.filter(s => !selectedIds.includes(s.id)));
    }
    
    setSelectedIds([]);
  };

  const handleRejectSelected = () => {
    if (modalTab !== 'pending') return;
    
    const toReject = pendingSpaces.filter(s => selectedIds.includes(s.id));
    
    // 거절 리스트로 이동
    setRejectedSpaces(prev => [...toReject, ...prev]);
    setPendingSpaces(prev => prev.filter(s => !selectedIds.includes(s.id)));
    
    setSelectedIds([]);
  };

  const currentModalList = modalTab === 'pending' ? pendingSpaces : rejectedSpaces;

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
            <StatBadge $color="green">+12%</StatBadge>
          </StatCardTop>
          <StatLabel>전체 숙소 수</StatLabel>
          <StatValue>1,284</StatValue>
        </StatCard>

        <StatCard>
          <StatCardTop>
            <StatIconWrap $bg="rgba(59,130,246,0.1)" $color="#2563eb">
              <CheckCircleIcon />
            </StatIconWrap>
            <StatBadge $color="blue">{Math.round((spaces.length / SPACES_TOTAL) * 100)}% 운영 중</StatBadge>
          </StatCardTop>
          <StatLabel>운영 중인 숙소</StatLabel>
          <StatValue>{spaces.length.toLocaleString()}</StatValue>
        </StatCard>

        <StatCard style={{ cursor: 'pointer' }} onClick={() => setIsModalOpen(true)}>
          <StatCardTop>
            <StatIconWrap $bg="rgba(249,115,22,0.1)" $color="#ea580c">
              <AlertIcon />
            </StatIconWrap>
            <StatBadge $color="orange">조치 필요</StatBadge>
          </StatCardTop>
          <StatLabel>승인 대기 중</StatLabel>
          <StatValue>{pendingSpaces.length}</StatValue>
        </StatCard>
      </StatsSection>

      {/* ── 테이블 섹션 ── */}
      <TableSection>
        <Toolbar>
          <ToolbarLeft>
            <SearchWrap>
              <SearchIconWrap><Search size={14} color="#94a3b8" /></SearchIconWrap>
              <SearchInput
                type="text"
                placeholder="숙소 이름 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <ClearBtn onClick={() => setSearchQuery('')}>
                  <X size={13} color="#94a3b8" />
                </ClearBtn>
              )}
            </SearchWrap>
          </ToolbarLeft>
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
        </Toolbar>

        <Table>
          <THead>
            <TR>
              <TH $width="320px">숙소 이름</TH>
              <TH $width="200px">판매자</TH>
              <TH $width="130px">1박 요금</TH>
              <TH $width="110px">등록일</TH>
              <TH $width="100px">현재상태</TH>
            </TR>
          </THead>
          <TBody>
            {filteredSpaces.length === 0 ? (
                <TR><TD colSpan={5}><EmptyTableState>검색 결과가 없습니다.</EmptyTableState></TD></TR>
            ) : filteredSpaces.map((space) => {
              const blinded = isBlinded(space);
              return (
                <TR key={space.id} $hoverable>
                  <TD>
                    <SpaceCell>
                      <SpaceThumbnail src={space.thumbnail} alt={space.name} $blinded={blinded} />
                      <SpaceInfo>
                        <SpaceName $blinded={blinded}>{space.name}</SpaceName>
                        <SpaceLocation>{space.location}</SpaceLocation>
                      </SpaceInfo>
                    </SpaceCell>
                  </TD>
                  <TD><SellerText>{space.seller}</SellerText></TD>
                  <TD><PriceText>{space.price}</PriceText></TD>
                  <TD><DateText>{space.registeredAt}</DateText></TD>
                  <TD>
                    <ToggleRow onClick={() => handleBlindClick(space)}>
                      <ToggleTrack $on={blinded}>
                        <ToggleThumb $on={blinded} />
                      </ToggleTrack>
                      <ToggleLabel $on={blinded}>{blinded ? '중지' : '공개'}</ToggleLabel>
                    </ToggleRow>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>

        <TableFooter>
          <AdminPagination
            currentPage={currentPage}
            totalPages={SPACES_TOTAL_PAGES}
            onPageChange={goToPage}
          />
        </TableFooter>
      </TableSection>

      {/* ── 블라인드 확인 모달 ── */}
      <ConfirmModal
        isOpen={blindConfirmTarget !== null}
        onClose={() => setBlindConfirmTarget(null)}
        onConfirm={handleBlindConfirm}
        title={blindConfirmTarget?.willBlind ? '숙소를 블라인드 처리하시겠습니까?' : '블라인드를 해제하시겠습니까?'}
        description={
          blindConfirmTarget
            ? blindConfirmTarget.willBlind
              ? `${blindConfirmTarget.name} 숙소가 사용자에게 노출되지 않습니다.`
              : `${blindConfirmTarget.name} 숙소가 다시 공개됩니다.`
            : ''
        }
        isDanger={blindConfirmTarget?.willBlind}
        confirmText={blindConfirmTarget?.willBlind ? '블라인드' : '공개하기'}
        icon={<EyeOff size={24} color={blindConfirmTarget?.willBlind ? '#ef4444' : '#64748b'} />}
      />

      {/* ── 승인/거절 모달 ── */}
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
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

const BADGE_COLORS = {
  green:  { bg: '#f0fdf4', color: '#16a34a' },
  blue:   { bg: '#eff6ff', color: '#2563eb' },
  orange: { bg: '#fff7ed', color: '#ea580c' },
};

const StatBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  background: ${({ $color }) => BADGE_COLORS[$color].bg};
  color: ${({ $color }) => BADGE_COLORS[$color].color};
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

const ToolbarLeft = styled.div`
  display: flex;
  gap: 8px;
`;

const SearchWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIconWrap = styled.div`
  position: absolute;
  left: 10px;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 220px;
  padding: 7px 32px 7px 32px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #0d1c2e;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
  &::placeholder { color: #94a3b8; }
  &:focus {
    outline: none;
    border-color: #244c54;
    box-shadow: 0 0 0 3px rgba(36,76,84,0.08);
  }
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 8px;
  display: flex;
  align-items: center;
  padding: 2px;
  border-radius: 4px;
  transition: background 0.15s;
  &:hover { background: #f1f5f9; }
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

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
`;

const ToggleTrack = styled.div`
  width: 40px;
  height: 22px;
  border-radius: 999px;
  background: ${({ $on }) => ($on ? '#ef4444' : '#22c55e')};
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;
`;

const ToggleThumb = styled.div`
  position: absolute;
  top: 3px;
  left: ${({ $on }) => ($on ? '21px' : '3px')};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transition: left 0.2s;
`;

const ToggleLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ $on }) => ($on ? '#dc2626' : '#16a34a')};
  min-width: 40px;
`;

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

/* ── Modal Styled Components ── */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  width: 500px;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #0d1c2e;
`;

const ModalCloseBtn = styled.button`
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  &:hover { color: #475569; }
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
