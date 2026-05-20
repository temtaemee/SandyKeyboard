import styled from 'styled-components';
import { MapPin, CalendarDays, Users, ChevronDown } from 'lucide-react';
import MyPageSidebar from '../components/MyPageSidebar';

function MyReservationPage() {
  const reservationList = [
    {
      id: 1,
      title: '부산 씨사이드 허브',
      location: '부산 해운대',
      room: '오션뷰 스튜디오',
      date: '10.24 - 10.31',
      people: '성인 2명',
      price: '₩1,240,000',
      status: '예약 완료',
      image:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200',
    },
    {
      id: 2,
      title: '제주 파인 포레스트 리트릿',
      location: '제주 서귀포',
      room: '숲속 1동',
      date: '08.12 - 08.16',
      people: '성인 1명',
      price: '₩890,000',
      status: '이용 예정',
      image:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200',
    },
    {
      id: 3,
      title: '강릉 웨이브 포트',
      location: '강릉 경포대',
      room: '복층 오션뷰',
      date: '12.15 - 12.22',
      people: '성인 4명',
      price: '₩2,100,000',
      status: '예약 완료',
      image:
        'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200',
    },
  ];

  return (
    <Container>
      <MyPageSidebar />
      <Main>
        <PageTitle>나의 예약 내역</PageTitle>

        <PageDesc>
          다가올 워케이션을 관리하고 지난 추억을 확인해 보세요.
        </PageDesc>

        <TabArea>
          <TabButton active>전체 예약</TabButton>
          <TabButton>확정된 예약</TabButton>
          <TabButton>이용 완료</TabButton>
          <TabButton>취소 내역</TabButton>
        </TabArea>

        <CardList>
          {reservationList.map((item) => (
            <ReservationCard key={item.id}>
              <Thumbnail src={item.image} alt="" />

              <Content>
                <TopRow>
                  <div>
                    <Title>{item.title}</Title>

                    <Location>
                      <MapPin size={14} />
                      {item.location}
                    </Location>
                  </div>

                  <PriceArea>
                    <PriceLabel>결제 금액</PriceLabel>
                    <Price>{item.price}</Price>
                  </PriceArea>
                </TopRow>

                <InfoRow>
                  <InfoItem>
                    <CalendarDays size={14} />
                    {item.date}
                  </InfoItem>

                  <Divider />

                  <InfoItem>
                    <Users size={14} />
                    {item.people}
                  </InfoItem>

                  <Divider />

                  <RoomText>{item.room}</RoomText>
                </InfoRow>

                <BottomRow>
                  <StatusBadge>{item.status}</StatusBadge>

                  <DetailButton>상세</DetailButton>
                </BottomRow>
              </Content>
            </ReservationCard>
          ))}
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
  background-color: ${({ active }) => (active ? '#3f6971' : 'white')};
  color: ${({ active }) => (active ? 'white' : '#6b7280')};

  padding: 10px 18px;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;

  box-shadow: ${({ active }) =>
    active ? 'none' : '0 1px 3px rgba(0,0,0,0.05)'};
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
