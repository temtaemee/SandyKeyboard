import styled from 'styled-components';
import { TicketPercent, ChevronRight, Download } from 'lucide-react';
import MyPageSidebar from '../components/MyPageSidebar';

function MyCouponPage() {
  const couponList = [
    {
      id: 1,
      title: '첫 예약 전용 10% 할인 쿠폰',
      desc: '워케이션 숙소 예약 시 사용 가능',
      expire: '2026.06.30 까지',
      discount: '10%',
      status: '사용 가능',
    },
    {
      id: 2,
      title: '주중 숙박 5만원 할인',
      desc: '평일 예약 시 적용 가능',
      expire: '2026.07.15 까지',
      discount: '₩50,000',
      status: '사용 가능',
    },
    {
      id: 3,
      title: '제주 지역 한정 쿠폰',
      desc: '제주 숙소 예약 전용',
      expire: '2026.08.01 까지',
      discount: '15%',
      status: '사용 완료',
    },
  ];

  const historyList = [
    {
      id: 1,
      date: '2026.05.14',
      title: '첫 예약 10% 할인 쿠폰 발급',
      type: '쿠폰 발급',
      status: '사용 가능',
    },
    {
      id: 2,
      date: '2026.05.10',
      title: '강릉 웨이브 포트 예약 할인 적용',
      type: '쿠폰 사용',
      status: '사용 완료',
    },
    {
      id: 3,
      date: '2026.05.01',
      title: '친구 초대 이벤트 쿠폰 지급',
      type: '이벤트',
      status: '사용 가능',
    },
  ];

  return (
    <Container>
      <MyPageSidebar />

      <Main>
        <PageLabel>포인트 / 쿠폰</PageLabel>

        <PageTitle>쿠폰 관리</PageTitle>

        <PageDesc>보유 중인 쿠폰과 사용 내역을 확인해보세요.</PageDesc>

        <TopSection>
          <SummaryCard>
            <SummaryTop>
              <CouponIcon>
                <TicketPercent size={28} />
              </CouponIcon>

              <SummaryInfo>
                <SummaryLabel>사용 가능한 쿠폰</SummaryLabel>

                <SummaryCount>2장</SummaryCount>
              </SummaryInfo>
            </SummaryTop>

            <SummaryNotice>이번 달 만료 예정 쿠폰이 있습니다.</SummaryNotice>

            <CouponButton>쿠폰 등록하기</CouponButton>
          </SummaryCard>

          <CouponSection>
            <CouponHeader>
              <h3>사용 가능한 쿠폰</h3>

              <MoreText>
                전체보기
                <ChevronRight size={16} />
              </MoreText>
            </CouponHeader>

            <CouponList>
              {couponList
                .filter((item) => item.status === '사용 가능')
                .map((item) => (
                  <CouponCard key={item.id}>
                    <DiscountBox>{item.discount}</DiscountBox>

                    <CouponContent>
                      <CouponTitle>{item.title}</CouponTitle>

                      <CouponDesc>{item.desc}</CouponDesc>

                      <ExpireText>{item.expire}</ExpireText>
                    </CouponContent>

                    <DownloadButton>
                      <Download size={16} />
                    </DownloadButton>
                  </CouponCard>
                ))}
            </CouponList>
          </CouponSection>
        </TopSection>

        <HistorySection>
          <HistoryHeader>
            <SectionTitle>쿠폰 사용 내역</SectionTitle>

            <FilterArea>
              <FilterButton active>최근 3개월</FilterButton>

              <FilterButton>전체 내역</FilterButton>
            </FilterArea>
          </HistoryHeader>

          <HistoryTable>
            <thead>
              <tr>
                <th>일자</th>
                <th>내역</th>
                <th>구분</th>
                <th>상태</th>
              </tr>
            </thead>

            <tbody>
              {historyList.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.title}</td>
                  <td>{item.type}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </HistoryTable>

          <MoreHistoryButton>전체 내역 더보기</MoreHistoryButton>
        </HistorySection>
      </Main>
    </Container>
  );
}

/* ================= styled ================= */

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 160px);
  background-color: #f7f9fb;
`;

const Main = styled.main`
  flex: 1;
  padding: 42px;
`;

const PageLabel = styled.div`
  font-size: 13px;
  color: #94a3b8;
  margin-bottom: 10px;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  color: #374151;
  margin-bottom: 10px;
`;

const PageDesc = styled.p`
  color: #94a3b8;
  margin-bottom: 34px;
`;

const TopSection = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 34px;
`;

const SummaryCard = styled.div`
  width: 340px;
  background-color: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.04);
`;

const SummaryTop = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 28px;
`;

const CouponIcon = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 20px;
  background-color: #dff4f7;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #3f6971;
`;

const SummaryInfo = styled.div``;

const SummaryLabel = styled.div`
  color: #94a3b8;
  font-size: 13px;
  margin-bottom: 8px;
`;

const SummaryCount = styled.div`
  font-size: 38px;
  font-weight: 700;
  color: #374151;
`;

const SummaryNotice = styled.div`
  background-color: #fff5f5;
  color: #dc2626;
  border-radius: 14px;
  padding: 14px;
  font-size: 13px;
  margin-bottom: 22px;
`;

const CouponButton = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 999px;
  background-color: #3f6971;
  color: white;
  cursor: pointer;
`;

const CouponSection = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 24px;
  padding: 28px;
`;

const CouponHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h3 {
    font-size: 22px;
    color: #374151;
  }
`;

const MoreText = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
`;

const CouponList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const CouponCard = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  background-color: #f8fafb;
  border-radius: 18px;
  padding: 18px;
`;

const DiscountBox = styled.div`
  min-width: 90px;
  height: 90px;
  border-radius: 18px;
  background-color: #fff3cd;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #8a6d1f;
  font-size: 24px;
  font-weight: 700;
`;

const CouponContent = styled.div`
  flex: 1;
`;

const CouponTitle = styled.h4`
  font-size: 16px;
  color: #374151;
  margin-bottom: 8px;
`;

const CouponDesc = styled.p`
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 6px;
`;

const ExpireText = styled.div`
  color: #94a3b8;
  font-size: 12px;
`;

const DownloadButton = styled.button`
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background-color: white;
  color: #64748b;
  cursor: pointer;
`;

const HistorySection = styled.section`
  background-color: white;
  border-radius: 24px;
  padding: 28px;
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 22px;
  color: #374151;
`;

const FilterArea = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterButton = styled.button`
  border: none;
  background-color: ${({ active }) => (active ? '#3f6971' : '#eef2f4')};
  color: ${({ active }) => (active ? 'white' : '#6b7280')};

  height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: #f8fafb;
  }

  th {
    text-align: left;
    padding: 16px;
    font-size: 13px;
    color: #94a3b8;
    font-weight: 500;
  }

  td {
    padding: 18px 16px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 14px;
    color: #4b5563;
  }
`;

const MoreHistoryButton = styled.button`
  display: block;
  margin: 28px auto 0;
  border: none;
  background-color: #eef2f4;
  color: #64748b;
  height: 42px;
  padding: 0 24px;
  border-radius: 999px;
  cursor: pointer;
`;

export default MyCouponPage;
