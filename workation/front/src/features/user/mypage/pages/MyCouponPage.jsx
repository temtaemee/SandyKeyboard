import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { TicketPercent, ChevronRight, Download } from 'lucide-react';
import { getMemberCouponList } from '../../../admin/api/adminBoardApi';
import MyPageSidebar from '../components/MyPageSidebar';
import { useNavigate } from 'react-router-dom';

function MyCouponPage() {
  // 1. 상태(State) 관리
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navi = useNavigate();

  // 현재 로그인된 유저의 username 샘플 (실제 프로젝트의 Auth context나 localStorage 등에서 가져오도록 수정 가능)
  const currentUsername = 'user01';

  // 2. API 데이터 로드
  useEffect(() => {
    // pno=1(첫 페이지), username 전달
    getMemberCouponList(1, currentUsername)
      .then((res) => {
        // Axios 응답 구조(res.data) 혹은 백엔드 반환 형태에 맞게 세팅
        // 만약 통신부에서 이미 .then((res) => res.data) 처리를 했다면 res 자체를 넣으시면 됩니다.
        const data = res.data || res;
        const actualContent = data.content || data;
        setCoupons(actualContent);
        setLoading(false);
      })
      .catch((err) => {
        console.error('쿠폰 목록을 불러오는데 실패했습니다.', err);
        setLoading(false);
      });
  }, [currentUsername]);

  // 3. 유틸리티 함수: 날짜 포맷팅 (LocalDateTime -> YYYY.MM.DD)
  const formatDate = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 4. 동적 데이터 필터링
  const availableCoupons = coupons.filter((c) => c.usedYn === 'N'); // 사용 가능한 쿠폰
  const usedCoupons = coupons.filter((c) => c.usedYn === 'Y'); // 사용 완료 내역

  return (
    <Container>
      <MyPageSidebar />

      <Main>
        <PageTitle>쿠폰 관리</PageTitle>
        <PageDesc>보유 중인 쿠폰과 사용 내역을 확인해보세요.</PageDesc>

        {loading ? (
          <LoadingState>쿠폰 정보를 불러오는 중입니다...</LoadingState>
        ) : (
          <>
            <TopSection>
              {/* 좌측 요약 카드 Area */}
              <SummaryCard>
                <SummaryTop>
                  <CouponIcon>
                    <TicketPercent size={28} />
                  </CouponIcon>

                  <SummaryInfo>
                    <SummaryLabel>사용 가능한 쿠폰</SummaryLabel>
                    {/* 하드코딩 탈출: 사용가능 쿠폰 length 실시간 바인딩 */}
                    <SummaryCount>{availableCoupons.length}장</SummaryCount>
                  </SummaryInfo>
                </SummaryTop>

                {availableCoupons.length > 0 && (
                  <SummaryNotice>
                    보유하신 쿠폰의 만료일을 확인하고 사용하세요.
                  </SummaryNotice>
                )}

                <CouponButton
                  onClick={() => {
                    navi(`/event`);
                  }}
                >
                  새로운 쿠폰 등록
                </CouponButton>
              </SummaryCard>

              {/* 우측 사용 가능한 쿠폰 리스트 Area */}
              <CouponSection>
                <CouponHeader>
                  <h3>사용 가능한 쿠폰</h3>
                  <MoreText>
                    전체보기
                    <ChevronRight size={16} />
                  </MoreText>
                </CouponHeader>

                <CouponList>
                  {availableCoupons.length === 0 ? (
                    <EmptyBlock>
                      현재 사용할 수 있는 쿠폰이 없습니다.
                    </EmptyBlock>
                  ) : (
                    availableCoupons.map((item) => (
                      <CouponCard key={item.id}>
                        {/* 백엔드 discountRate 연결 */}
                        <DiscountBox>{item.discountRate}%</DiscountBox>

                        <CouponContent>
                          {/* 백엔드 couponName 연결 */}
                          <CouponTitle>{item.couponName}</CouponTitle>
                          <CouponDesc>
                            워케이션 상품 결제 시 즉시 할인 적용
                          </CouponDesc>
                          {/* 백엔드 expiredDate 포맷팅 연결 */}
                          <ExpireText>
                            {formatDate(item.expiredDate)} 까지
                          </ExpireText>
                        </CouponContent>

                        <DownloadButton title="쿠폰 정보 확인">
                          <Download size={16} />
                        </DownloadButton>
                      </CouponCard>
                    ))
                  )}
                </CouponList>
              </CouponSection>
            </TopSection>

            {/* 하단 쿠폰 사용 및 발급 히스토리 내역 Area */}
            <HistorySection>
              <HistoryHeader>
                <SectionTitle>쿠폰 내역 히스토리</SectionTitle>
                <FilterArea>
                  <FilterButton active>전체 내역</FilterButton>
                </FilterArea>
              </HistoryHeader>

              <HistoryTable>
                <thead>
                  <tr>
                    <th>일자</th>
                    <th>쿠폰명</th>
                    <th>할인율</th>
                    <th>상태</th>
                  </tr>
                </thead>

                <tbody>
                  {coupons.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          textAlign: 'center',
                          color: '#94a3b8',
                          padding: '30px',
                        }}
                      >
                        조회된 쿠폰 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    coupons.map((item) => (
                      <tr key={item.id}>
                        {/* 발급일자 혹은 생성일자 표시 */}
                        <td>{formatDate(item.createdAt)}</td>
                        <td>{item.couponName}</td>
                        <td>{item.discountRate}%</td>
                        <td>
                          {item.usedYn === 'Y' ? (
                            <StatusBadge used>
                              {formatDate(item.usedAt)} 사용완료
                            </StatusBadge>
                          ) : (
                            <StatusBadge>사용가능</StatusBadge>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </HistoryTable>

              <MoreHistoryButton>내역 새로고침</MoreHistoryButton>
            </HistorySection>
          </>
        )}
      </Main>
    </Container>
  );
}

/* ================= styled ================= */
// 기존 유저분이 작성해 두신 완성도 높은 스타일링 레이아웃 코드를 완벽히 유지 보존하며 필요한 부가 컴포넌트만 추가했습니다.

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
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const SummaryCard = styled.div`
  width: 340px;
  background-color: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.04);
  @media (max-width: 1024px) {
    width: 100%;
  }
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
const SummaryInfo = styled.div`
  display: flex;
  flex-direction: column; /* 내부 요소들을 세로로 정렬 */
  justify-content: center;
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
  font-weight: 600;
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
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

/* ================= 새로 추가된 UI 스타일 컴포넌트 ================= */

const LoadingState = styled.div`
  text-align: center;
  padding: 80px 0;
  font-size: 16px;
  color: #64748b;
  background: white;
  border-radius: 24px;
`;

const EmptyBlock = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #94a3b8;
  font-size: 14px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${({ used }) => (used ? '#f1f5f9' : '#eef5f6')};
  color: ${({ used }) => (used ? '#94a3b8' : '#3f6971')};
`;

export default MyCouponPage;
