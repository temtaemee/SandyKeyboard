import styled from 'styled-components';
import {
  User,
  ClipboardList,
  CreditCard,
  History,
  Settings,
  Heart,
  Image,
  Wallet,
  Headphones,
  Megaphone,
  LogOut,
  ChevronRight,
  CalendarDays,
  MapPin,
} from 'lucide-react';
import MyPageSidebar from '../components/MyPageSidebar';
import useMypage from '../hooks/useMypage';

function MyPage() {
  const { memberInfo, loading } = useMypage();
  console.log(memberInfo);
  const formatDate = (dateString) => {
    return dateString.slice(0, 10);
  };

  if (loading) {
    return <div>로딩중...</div>;
  }
  return (
    <Container>
      {/* 사이드바 */}
      <MyPageSidebar memberInfo={memberInfo} />

      {/* 메인 */}
      <Main>
        <PageTitle>마이페이지</PageTitle>
        <PageDesc>{memberInfo?.name} 님의 워케이션 여정을 관리하세요.</PageDesc>

        {/* 프로필 영역 */}
        <TopSection>
          <ProfileCard>
            <ProfileLeft>
              <AvatarBox>
                <LaptopEmoji>💻</LaptopEmoji>
              </AvatarBox>

              <ProfileInfo>
                <UserName>{memberInfo?.name}</UserName>

                <UserSubTitle>Remote Explorer</UserSubTitle>

                <BadgeArea>
                  <GradeBadge>SHORELINE GOLD</GradeBadge>
                  <JoinDate>{formatDate(memberInfo?.joinDate)} 가입</JoinDate>
                </BadgeArea>

                <StatRow>
                  <StatItem>
                    <strong>12일</strong>
                    <span>올해 워케이션</span>
                  </StatItem>

                  <StatItem>
                    <strong>5곳</strong>
                    <span>방문 지역</span>
                  </StatItem>

                  <StatItem>
                    <strong>2건</strong>
                    <span>예정 예약</span>
                  </StatItem>
                </StatRow>
              </ProfileInfo>
            </ProfileLeft>
          </ProfileCard>

          <RightQuickMenu>
            <QuickCard>
              <Image size={20} />
              <QuickText>
                <strong>나의 리뷰</strong>
                <span>작성한 리뷰 보기</span>
              </QuickText>
            </QuickCard>

            <QuickCard>
              <Heart size={20} />
              <QuickText>
                <strong>찜한 숙소</strong>
                <span>저장한 공간 확인</span>
              </QuickText>
            </QuickCard>

            <WideCard>
              <CouponLeft>
                <Wallet size={20} />

                <div>
                  <strong>사용 가능한 쿠폰 3장</strong>
                  <p>이번 달 프로모션 쿠폰 포함</p>
                </div>
              </CouponLeft>

              <ChevronRight size={18} />
            </WideCard>
          </RightQuickMenu>
        </TopSection>

        {/* 예약 카드 */}
        <ReservationSection>
          <SectionTitle>
            <CalendarDays size={18} />
            현재 진행 중인 예약
          </SectionTitle>

          <ReservationCard>
            <ReservationImage
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200"
              alt=""
            />

            <ReservationContent>
              <ReservationTitle>부산 씨사이드 허브</ReservationTitle>

              <ReservationSub>오션뷰 스튜디오 워크룸</ReservationSub>

              <ReservationInfo>
                <InfoItem>
                  <CalendarDays size={15} />
                  2024.05.20 - 2024.05.25
                </InfoItem>

                <InfoItem>
                  <MapPin size={15} />
                  부산광역시 해운대구
                </InfoItem>
              </ReservationInfo>

              <ButtonArea>
                <PrimaryButton>예약 상세 확인</PrimaryButton>

                <SecondaryButton>예약 변경/취소</SecondaryButton>
              </ButtonArea>
            </ReservationContent>
          </ReservationCard>
        </ReservationSection>

        {/* 하단 카드 */}
        <BottomSection>
          <HistoryCard>
            <CardTitle>지난 워케이션 다시 보기</CardTitle>

            <HistoryItem>
              <HistoryThumb
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=400"
                alt=""
              />

              <HistoryInfo>
                <h4>제주 하이브 스테이</h4>
                <p>2024.03.12 - 2024.03.15</p>
              </HistoryInfo>

              <ChevronRight size={18} />
            </HistoryItem>

            <HistoryItem>
              <HistoryThumb
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=400"
                alt=""
              />

              <HistoryInfo>
                <h4>강릉 샌드 오피스텔</h4>
                <p>2023.12.01 - 2023.12.04</p>
              </HistoryInfo>

              <ChevronRight size={18} />
            </HistoryItem>
          </HistoryCard>
        </BottomSection>
      </Main>
    </Container>
  );
}

export default MyPage;

/* ================= styled ================= */

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 160px);
  background-color: #f7f9fb;
`;

const Sidebar = styled.aside`
  width: 240px;
  background-color: white;
  border-right: 1px solid #edf1f4;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const MenuSection = styled.div``;

const MenuTitle = styled.h2`
  font-size: 15px;
  color: #9ca3af;
  margin-bottom: 26px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 14px;
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 14px;
  color: ${({ active }) => (active ? '#3f6971' : '#6b7280')};
  background-color: ${({ active }) => (active ? '#eef5f6' : 'transparent')};
  font-weight: ${({ active }) => (active ? '600' : '400')};

  &:hover {
    background-color: #f3f6f8;
  }
`;

const BottomMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const BottomItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #9ca3af;
  font-size: 13px;
  cursor: pointer;
`;

const Main = styled.main`
  flex: 1;
  padding: 48px;
`;

const PageTitle = styled.h1`
  font-size: 36px;
  color: #374151;
  margin-bottom: 10px;
`;

const PageDesc = styled.p`
  color: #94a3b8;
  margin-bottom: 36px;
`;

const TopSection = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 30px;

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const ProfileCard = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 28px;
  padding: 36px;
`;

const ProfileLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ProfileImage = styled.img`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
`;
const AvatarBox = styled.div`
  width: 110px;
  height: 110px;
  border-radius: 28px;

  background: linear-gradient(135deg, #d9ecef, #eef5f6);

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;
`;

const LaptopEmoji = styled.div`
  font-size: 42px;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 32px;
  margin-bottom: 8px;
  color: #374151;
`;

const UserSubTitle = styled.div`
  font-size: 15px;
  color: #94a3b8;
  margin-bottom: 18px;
`;

const BadgeArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  flex-wrap: wrap;
`;

const GradeBadge = styled.div`
  background-color: #f5e6b5;
  color: #8a6d1f;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
`;

const JoinDate = styled.span`
  color: #94a3b8;
  font-size: 13px;
`;

const PointBox = styled.div`
  width: 200px;
  background-color: #f8fbfc;
  border-radius: 20px;
  padding: 24px;
`;

const StatRow = styled.div`
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  min-width: 120px;
  padding: 18px;
  border-radius: 18px;
  background-color: #f8fafb;

  strong {
    display: block;
    font-size: 24px;
    color: #3f6971;
    margin-bottom: 6px;
  }

  span {
    font-size: 13px;
    color: #64748b;
  }
`;

const RightQuickMenu = styled.div`
  width: 320px;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 1200px) {
    width: 100%;
  }
`;

const QuickCard = styled.div`
  background-color: white;
  border-radius: 22px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;

  color: #5f6b73;

  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: translateY(-3px);
  }
`;

const QuickText = styled.div`
  strong {
    display: block;
    font-size: 15px;
    margin-bottom: 6px;
    color: #374151;
  }

  span {
    font-size: 13px;
    color: #94a3b8;
  }
`;

const WideCard = styled.div`
  grid-column: span 2;

  background-color: white;
  border-radius: 22px;
  padding: 22px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  color: #5f6b73;

  cursor: pointer;
`;

const CouponLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  strong {
    display: block;
    margin-bottom: 6px;
    color: #374151;
  }

  p {
    font-size: 13px;
    color: #94a3b8;
  }
`;

const PointLabel = styled.div`
  color: #94a3b8;
  font-size: 13px;
  margin-bottom: 10px;
`;

const PointValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #3f6971;
  margin-bottom: 10px;
`;

const PointLink = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

const ReservationSection = styled.section`
  background-color: white;
  border-radius: 28px;
  padding: 30px;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
  margin-bottom: 24px;
`;

const ReservationCard = styled.div`
  display: flex;
  gap: 24px;
`;

const ReservationImage = styled.img`
  width: 280px;
  height: 180px;
  border-radius: 18px;
  object-fit: cover;
`;

const ReservationContent = styled.div`
  flex: 1;
`;

const ReservationTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 10px;
`;

const ReservationSub = styled.p`
  color: #64748b;
  margin-bottom: 18px;
`;

const ReservationInfo = styled.div`
  display: flex;
  gap: 18px;
  margin-bottom: 26px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 14px;
`;

const ButtonArea = styled.div`
  display: flex;
  gap: 14px;
`;

const PrimaryButton = styled.button`
  border: none;
  background-color: #3f6971;
  color: white;
  border-radius: 999px;
  padding: ${({ small }) => (small ? '12px 20px' : '14px 30px')};
  cursor: pointer;
`;

const SecondaryButton = styled.button`
  border: none;
  background-color: #eef2f4;
  color: #5b6470;
  border-radius: 999px;
  padding: 14px 24px;
  cursor: pointer;
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const HistoryCard = styled.div`
  background-color: white;
  border-radius: 28px;
  padding: 30px;
`;

const PointCard = styled.div`
  background-color: white;
  border-radius: 28px;
  padding: 30px;
`;

const CardTitle = styled.h3`
  font-size: 22px;
  margin-bottom: 24px;
`;

const HistoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
`;

const HistoryThumb = styled.img`
  width: 80px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
`;

const HistoryInfo = styled.div`
  flex: 1;

  h4 {
    font-size: 15px;
    margin-bottom: 6px;
  }

  p {
    color: #94a3b8;
    font-size: 13px;
  }
`;

const PointText = styled.p`
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 28px;
`;
