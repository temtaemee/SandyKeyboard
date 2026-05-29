import styled from 'styled-components';
import { CalendarDays } from 'lucide-react';

const STATUS_OPTIONS = ['전체', 'PENDING', 'CONFIRMED', 'CANCELLED'];
const STATUS_LABELS = {
  PENDING: '대기중',
  CONFIRMED: '예약확정',
  CANCELLED: '취소됨',
};

export default function ReservationPage() {
  return (
    <Wrap>
      <PageHeader>
        <TitleGroup>
          <PageTitle>예약 관리</PageTitle>
          <PageSub>공간 및 스테이 예약 내역을 관리합니다</PageSub>
        </TitleGroup>
      </PageHeader>

      {/* 필터 바 (UI만) */}
      <FilterBar>
        <FilterInput type="date" disabled placeholder="시작일" />
        <FilterSep>~</FilterSep>
        <FilterInput type="date" disabled placeholder="종료일" />
        <FilterSelect disabled>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === '전체' ? '전체 상태' : STATUS_LABELS[s] ?? s}
            </option>
          ))}
        </FilterSelect>
      </FilterBar>

      {/* 서비스 준비 중 */}
      <ContentCard>
        <CalendarDays size={40} color="#cbd5e1" />
        <PrepareMsg>서비스 준비 중입니다</PrepareMsg>
        <PrepareDesc>예약 조회 API가 구현되면 자동으로 연동됩니다.</PrepareDesc>

        {/* 테이블 컬럼 스케치 */}
        <PlaceholderTable>
          <thead>
            <tr>
              {['예약번호', '예약자', '공간/스테이', '체크인', '체크아웃', '결제금액', '상태'].map(
                (col) => <Th key={col}>{col}</Th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td colSpan={7}>
                <EmptyRow>데이터 없음</EmptyRow>
              </Td>
            </tr>
          </tbody>
        </PlaceholderTable>
      </ContentCard>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  letter-spacing: -0.4px;
`;

const PageSub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterInput = styled.input`
  height: 38px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  background: #f8fafc;
  font-family: inherit;
  cursor: not-allowed;
  opacity: 0.6;
`;

const FilterSep = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FilterSelect = styled.select`
  height: 38px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  background: #f8fafc;
  font-family: inherit;
  cursor: not-allowed;
  opacity: 0.6;
`;

const ContentCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 40px 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const PrepareMsg = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  margin-top: 8px;
`;

const PrepareDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 16px;
`;

const PlaceholderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  background: ${({ theme }) => theme.colors.bgSection};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Td = styled.td`
  padding: 0;
`;

const EmptyRow = styled.div`
  padding: 32px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;
