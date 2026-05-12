// src/features/admin/pages/AdminSpacesPage.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { Home, CheckCircle, AlertTriangle, Filter, Trash2 } from 'lucide-react';
import {
  SPACES_STAT_CARDS,
  SPACES_STATUS_MAP,
  SPACES_LIST,
} from '../data/adminSpacesData';

const TOTAL = 1284;
const TOTAL_PAGES = 12;

export default function AdminSpacesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [spaces, setSpaces] = useState(SPACES_LIST);

  const handleDeleteConfirm = () => {
    setSpaces((prev) => prev.filter((s) => s.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

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
        {/* 카드 1: 전체 숙소 수 */}
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

        {/* 카드 2: 운영 중인 숙소 */}
        <StatCard>
          <StatCardTop>
            <StatIconWrap $bg="rgba(59,130,246,0.1)" $color="#2563eb">
              <CheckCircleIcon />
            </StatIconWrap>
            <StatBadge $color="blue">92% 운영 중</StatBadge>
          </StatCardTop>
          <StatLabel>운영 중인 숙소</StatLabel>
          <StatValue>1,182</StatValue>
        </StatCard>

        {/* 카드 3: 승인 대기 중 */}
        <StatCard>
          <StatCardTop>
            <StatIconWrap $bg="rgba(249,115,22,0.1)" $color="#ea580c">
              <AlertIcon />
            </StatIconWrap>
            <StatBadge $color="orange">조치 필요</StatBadge>
          </StatCardTop>
          <StatLabel>승인 대기 중</StatLabel>
          <StatValue>24</StatValue>
        </StatCard>
      </StatsSection>

      {/* ── 테이블 섹션 ── */}
      <TableSection>
        {/* 툴바 */}
        <Toolbar>
          <ToolbarLeft>
            <FilterBtn>
              <FilterIcon />
              필터
            </FilterBtn>
          </ToolbarLeft>
          <TotalText>전체 {TOTAL.toLocaleString()}개 중 1-10 표시</TotalText>
        </Toolbar>

        {/* 테이블 */}
        <Table>
          <THead>
            <TR>
              <TH $width="320px">숙소 이름</TH>
              <TH $width="200px">판매자</TH>
              <TH $width="130px">1박 요금</TH>
              <TH $width="90px">상태</TH>
              <TH $width="110px">등록일</TH>
              <TH $width="80px">관리</TH>
            </TR>
          </THead>
          <TBody>
            {spaces.map((space) => (
              <TR key={space.id} $hoverable>
                {/* 숙소 이름 */}
                <TD>
                  <SpaceCell>
                    <SpaceThumbnail src={space.thumbnail} alt={space.name} />
                    <SpaceInfo>
                      <SpaceName>{space.name}</SpaceName>
                      <SpaceLocation>{space.location}</SpaceLocation>
                    </SpaceInfo>
                  </SpaceCell>
                </TD>
                {/* 판매자 */}
                <TD><SellerText>{space.seller}</SellerText></TD>
                {/* 요금 */}
                <TD><PriceText>{space.price}</PriceText></TD>
                {/* 상태 */}
                <TD>
                  <StatusBadge
                    $bg={SPACES_STATUS_MAP[space.status].bg}
                    $color={SPACES_STATUS_MAP[space.status].color}
                  >
                    {SPACES_STATUS_MAP[space.status].label}
                  </StatusBadge>
                </TD>
                {/* 등록일 */}
                <TD><DateText>{space.registeredAt}</DateText></TD>
                {/* 관리: 삭제만 */}
                <TD>
                  <ActionGroup>
                    <IconBtn
                      $danger
                      onClick={() => setDeleteTargetId(space.id)}
                      title="삭제"
                    >
                      <TrashIcon />
                    </IconBtn>
                  </ActionGroup>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>

        {/* 페이지네이션 */}
        <TableFooter>
          <PrevBtn
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            &lt; 이전
          </PrevBtn>
          <Pagination>
            {[1, 2, 3].map((p) => (
              <PageBtn
                key={p}
                $active={currentPage === p}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </PageBtn>
            ))}
            <PageEllipsis>...</PageEllipsis>
            <PageBtn
              $active={currentPage === 12}
              onClick={() => setCurrentPage(12)}
            >
              12
            </PageBtn>
          </Pagination>
          <NextBtn
            onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
            disabled={currentPage === TOTAL_PAGES}
          >
            다음 &gt;
          </NextBtn>
        </TableFooter>
      </TableSection>

      {/* ── 삭제 확인 모달 ── */}
      {deleteTargetId !== null && (
        <ModalOverlay onClick={() => setDeleteTargetId(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>숙소를 삭제하시겠습니까?</ModalTitle>
            <ModalDesc>
              삭제된 숙소는 복구할 수 없습니다.
            </ModalDesc>
            <ModalActions>
              <ModalCancelBtn onClick={() => setDeleteTargetId(null)}>
                취소
              </ModalCancelBtn>
              <ModalDeleteBtn onClick={handleDeleteConfirm}>
                삭제
              </ModalDeleteBtn>
            </ModalActions>
          </Modal>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
}

/* ── Icon Components ── */
function SpaceIcon() { return <Home size={20} />; }
function CheckCircleIcon() { return <CheckCircle size={20} />; }
function AlertIcon() { return <AlertTriangle size={20} />; }
function FilterIcon() { return <Filter size={13} />; }
function TrashIcon() { return <Trash2 size={14} />; }

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

/* 통계 카드 */
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

/* 테이블 섹션 */
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

const FilterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  font-family: inherit;
  transition: background 0.15s;
  &:hover { background: #f8fafc; }
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

/* 숙소 셀 */
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
`;

const SpaceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SpaceName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #0d1c2e;
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

const StatusBadge = styled.span`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconBtn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $danger }) => ($danger ? '#ef4444' : '#64748b')};
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: ${({ $danger }) => ($danger ? '#fee2e2' : '#f1f5f9')};
    color: ${({ $danger }) => ($danger ? '#dc2626' : '#334155')};
  }
`;

/* 페이지네이션 */
const TableFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
`;

const PrevBtn = styled.button`
  font-size: 13px;
  font-weight: 500;
  color: ${({ disabled }) => (disabled ? '#cbd5e1' : '#475569')};
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${({ disabled }) => (disabled ? '#f1f5f9' : '#e2e8f0')};
  background: white;
  font-family: inherit;
  transition: background 0.15s;
  &:hover:not(:disabled) { background: #f8fafc; }
`;

const NextBtn = styled(PrevBtn)``;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PageBtn = styled.button`
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border-radius: 6px;
  border: ${({ $active }) => ($active ? 'none' : '1px solid #e2e8f0')};
  background: ${({ $active }) => ($active ? '#244c54' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#475569')};
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  font-family: 'Plus Jakarta Sans', sans-serif;
  &:hover {
    background: ${({ $active }) => ($active ? '#244c54' : '#f8fafc')};
  }
`;

const PageEllipsis = styled.span`
  font-size: 13px;
  color: #94a3b8;
  padding: 0 4px;
`;

/* 삭제 모달 */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  min-width: 320px;
`;

const ModalTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #0d1c2e;
`;

const ModalDesc = styled.p`
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 8px;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ModalCancelBtn = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  transition: background 0.15s;
  &:hover { background: #f8fafc; }
`;

const ModalDeleteBtn = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  background: #ef4444;
  color: white;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  transition: background 0.15s;
  &:hover { background: #dc2626; }
`;
