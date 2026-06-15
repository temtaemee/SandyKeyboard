import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MapPin, CalendarDays, Users, ChevronDown } from 'lucide-react';
import MyPageSidebar from '../components/MyPageSidebar';
import { getMyReservations } from '../../reservation/api/reservationApi';
import { useNavigate } from 'react-router-dom';
import { resolveAssetUrl } from '../../../../app/config/env';

function MyReservationPage() {
  // 🟩 상태 관리 (State)
  const [reservationList, setReservationList] = useState([]);
  const [activeTab, setActiveTab] = useState('전체 예약'); // 현재 활성화된 탭 상태
  const [loading, setLoading] = useState(true);
  const navi = useNavigate();

  // 🟩 1. 백엔드 API로부터 로그인된 유저의 예약 내역 가져오기
  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      alert('로그인이 필요합니다.');
      navi('/login');
      return;
    }

    // 세션스토리지든 로컬스토리지든 토큰이 있는 상태이므로 인터셉터가 헤더에 자동으로 실어 보냅니다.
    getMyReservations()
      .then((response) => {
        const targetData = response.data ? response.data : response;
        setReservationList(targetData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('예약 내역 로딩 실패:', error);
        setLoading(false);
      });
  }, [navi]);

  // 🟩 2. 데이터 포맷터 함수들 (백엔드 규격을 화면 규격으로 변환)

  // 날짜 변환 (2026-05-26 -> 05.26)
  const formatDateRange = (checkin, checkout) => {
    if (!checkin || !checkout) return '';
    const start = checkin.split('-'); // ['2026', '05', '26']
    const end = checkout.split('-');
    return `${start[1]}.${start[2]} - ${end[1]}.${end[2]}`;
  };

  // 가격 변환 (1240000 -> ₩1,240,000)
  const formatPrice = (price) => {
    if (price === undefined || price === null) return '₩0';
    return `₩${price.toLocaleString()}`;
  };

  // 🟩 3. 탭 클릭 시 화면에 필터링해서 보여줄 리스트 추출 로직
  const getFilteredList = () => {
    if (activeTab === '전체 예약') return reservationList;

    return reservationList.filter((item) => {
      // 1. 확정된 예약 탭: 결제 완료(PAYMENT_COMPLETED) 또는 판매자 승인으로 확정된 상태(RESERVED)
      if (activeTab === '확정된 예약') {
        return item.status === 'RESERVED';
      }
      if (activeTab === '승인 대기') {
        return item.status === 'PAYMENT_COMPLETED';
      }

      // 2. 이용 완료 탭: 숙소 이용이 완전히 끝난 상태(COMPLETED)
      if (activeTab === '이용 완료') {
        return item.status === 'COMPLETED';
      }

      // 3. 취소 내역 탭: 유저 취소(USER_CANCELLED), 판매자 취소(SELLER_CANCELLED), 환불 완료(REFUND_COMPLETED) 통합
      if (activeTab === '취소 내역') {
        return (
          item.status === 'USER_CANCELLED' ||
          item.status === 'SELLER_CANCELLED' ||
          item.status === 'REFUND_COMPLETED'
        );
      }

      return true;
    });
  };

  const filteredReservations = getFilteredList();

  if (loading) {
    return (
      <Container>
        <MyPageSidebar />
        <Main
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h3>예약 정보를 불러오는 중입니다... 🦀</h3>
        </Main>
      </Container>
    );
  }

  return (
    <Container>
      <MyPageSidebar />
      <Main>
        <PageTitle>나의 예약 내역</PageTitle>
        <PageDesc>
          다가올 워케이션을 관리하고 지난 추억을 확인해 보세요.
        </PageDesc>

        {/* 🟩 4. 탭 구역 동적 렌더링 및 활성화 이벤트 등록 */}
        <TabArea>
          {[
            '전체 예약',
            '승인 대기',
            '확정된 예약',
            '이용 완료',
            '취소 내역',
          ].map((tab) => (
            <TabButton
              key={tab}
              $active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </TabButton>
          ))}
        </TabArea>

        {/* 🟩 5. 카드 리스트 데이터 바인딩 */}
        <CardList>
          {filteredReservations.length === 0 ? (
            <EmptyBox>해당하는 예약 내역이 존재하지 않습니다.</EmptyBox>
          ) : (
            // 💡 여기 화살표 뒤를 ( 에서 { 로 변경했습니다!
            filteredReservations.map((item) => {
              // S3 주소 결합 로직 (필요에 맞게 수정)
              const thumbnailUrl = item.stayImageUrl
                ? resolveAssetUrl(item.stayImageUrl)
                : resolveAssetUrl('/dummy-images/gangwon/hotel1/강원1외관.png');

              // 💡 연산이 끝났으니 진짜 JSX를 return 해줍니다.
              return (
                <ReservationCard key={item.id}>
                  <Thumbnail
                    src={thumbnailUrl}
                    alt={item.stayName || '숙소 이미지'}
                  />

                  <Content>
                    <TopRow>
                      <div>
                        {/* 백엔드 DTO: stayName 매핑 */}
                        <Title>{item.stayName || '등록되지 않은 숙소'}</Title>

                        <Location>
                          <MapPin size={14} />
                          워케이션 파트너 스페이스
                        </Location>
                      </div>

                      <PriceArea>
                        <PriceLabel>결제 금액</PriceLabel>
                        {/* 백엔드 DTO: totalPrice 포맷팅 매핑 */}
                        <Price>{formatPrice(item.totalPrice)}</Price>
                      </PriceArea>
                    </TopRow>

                    <InfoRow>
                      <InfoItem>
                        <CalendarDays size={14} />
                        {/* 백엔드 DTO: checkinDate, checkoutDate 포맷팅 매핑 */}
                        {formatDateRange(item.checkinDate, item.checkoutDate)}
                      </InfoItem>

                      <Divider />

                      <InfoItem>
                        <Users size={14} />
                        {/* 백엔드 DTO: guestCount 매핑 */}
                        성인 {item.guestCount || 1}명
                      </InfoItem>

                      <Divider />

                      <RoomText>예약자: {item.primaryGuestName}</RoomText>
                    </InfoRow>

                    <BottomRow>
                      {/* 백엔드 DTO: statusLabel(한글 라벨명) 바인딩 */}
                      <StatusBadge>
                        {item.statusLabel || '상태 없음'}
                      </StatusBadge>

                      <DetailButton
                        onClick={() => navi(`/mypage/reservation/${item.id}`)}
                      >
                        상태 상세
                      </DetailButton>
                    </BottomRow>
                  </Content>
                </ReservationCard>
              ); // 💡 return 괄호 닫기
            }) // 💡 map 중괄호 닫기
          )}
        </CardList>

        <MoreButton>
          예약 내역 더보기
          <ChevronDown size={16} />
        </MoreButton>
      </Main>
    </Container>
  );
}

export default MyReservationPage;

/* ================= styled ================= */
// 🚨 아까 콘솔창에서 리액트가 툴툴거렸던 속성 에러 방지를 위해 active 앞에 $를 붙여 Transient Props로 교체했습니다!

const Main = styled.main`
  flex: 1;
  padding: 42px;
`;

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 160px);
  background-color: #f7f9fb;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  color: #374151;
  margin-bottom: 10px;
`;

const PageDesc = styled.p`
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 26px;
`;

const TabArea = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 26px;
`;

const TabButton = styled.button`
  border: none;
  background-color: ${({ $active }) => ($active ? '#3f6971' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#6b7280')};

  padding: 10px 18px;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;

  box-shadow: ${({ $active }) =>
    $active ? 'none' : '0 1px 3px rgba(0,0,0,0.05)'};
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ReservationCard = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  gap: 18px;
`;

const Thumbnail = styled.img`
  width: 190px;
  height: 130px;
  border-radius: 14px;
  object-fit: cover;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
`;

const Title = styled.h2`
  font-size: 20px;
  color: #374151;
  margin-bottom: 8px;
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 13px;
`;

const PriceArea = styled.div`
  text-align: right;
`;

const PriceLabel = styled.div`
  color: #9ca3af;
  font-size: 12px;
  margin-bottom: 6px;
`;

const Price = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #3f6971;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 18px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Divider = styled.div`
  width: 1px;
  height: 12px;
  background-color: #d1d5db;
`;

const RoomText = styled.div`
  color: #64748b;
`;

const BottomRow = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusBadge = styled.div`
  background-color: #eef5f6;
  color: #3f6971;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
`;

const DetailButton = styled.button`
  border: none;
  background-color: #3f6971;
  color: white;
  width: 72px;
  height: 36px;
  border-radius: 999px;
  cursor: pointer;
`;

const MoreButton = styled.button`
  margin: 34px auto 0;
  border: none;
  background-color: #e8edf0;
  color: #64748b;
  height: 42px;
  padding: 0 22px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

const EmptyBox = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 50px;
  text-align: center;
  color: #94a3b8;
  font-size: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
`;
