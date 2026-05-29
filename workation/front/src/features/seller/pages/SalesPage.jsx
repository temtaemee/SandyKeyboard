import styled from 'styled-components';
import { DollarSign, TrendingUp, CalendarDays } from 'lucide-react';

export default function SalesPage() {
  return (
    <Wrap>
      <PageHeader>
        <TitleGroup>
          <PageTitle>매출 관리</PageTitle>
          <PageSub>공간 및 스테이 매출 내역을 확인합니다</PageSub>
        </TitleGroup>
      </PageHeader>

      {/* 요약 카드 */}
      <SummaryGrid>
        <SummaryCard>
          <IconBg $color="#dcfce7">
            <DollarSign size={22} color="#15803d" />
          </IconBg>
          <SummaryLabel>총 매출</SummaryLabel>
          <SummaryValue>--</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <IconBg $color="#dbeafe">
            <TrendingUp size={22} color="#1d4ed8" />
          </IconBg>
          <SummaryLabel>이번 달 매출</SummaryLabel>
          <SummaryValue>--</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <IconBg $color="#ffedd5">
            <CalendarDays size={22} color="#c2410c" />
          </IconBg>
          <SummaryLabel>예약 건수</SummaryLabel>
          <SummaryValue>--</SummaryValue>
        </SummaryCard>
      </SummaryGrid>

      {/* 서비스 준비 중 */}
      <ContentCard>
        <PrepareMsg>서비스 준비 중입니다</PrepareMsg>
        <PrepareDesc>매출 데이터 API가 구현되면 자동으로 연동됩니다.</PrepareDesc>
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

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const SummaryCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const IconBg = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const SummaryLabel = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SummaryValue = styled.p`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const ContentCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 64px 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const PrepareMsg = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const PrepareDesc = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;
