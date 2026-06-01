import styled from 'styled-components';
import {
  Image,
  Heart,
  Wallet,
  ChevronRight,
  CalendarDays,
  MapPin,
} from 'lucide-react';
import MyPageSidebar from '../components/MyPageSidebar';
import useMypage from '../hooks/useMypage';
import { useNavigate } from 'react-router-dom';
import ProfileAvatar from '../components/ProfileAvatar';

function MyPage() {
  // 리팩토링된 훅에서 dashboardData를 함께 꺼내옵니다. ✨
  const { memberInfo, dashboardData, loading } = useMypage();
  const navi = useNavigate();

  // 날짜 가공 함수 (YYYY-MM-DD 형식 추출)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.slice(0, 10).replace(/-/g, '.'); // 대시(-)를 점(.)으로 가공
  };

  if (loading) {
    return <LoadingWrapper>로딩중...</LoadingWrapper>;
  }

  // 캡슐화 방어: 예약 정보와 지난 워케이션 정보 가독성 배치
  const currentRes = dashboardData?.currentReservation;
  const pastWorkations = dashboardData?.pastWorkations || [];

  return (
    <Container>
      {/* 사이드바 */}
      <MyPageSidebar memberInfo={memberInfo} />

      {/* 메인 */}
      <Main>
        <PageTitle>마이페이지</PageTitle>
        <PageDesc>
          {memberInfo?.name || '회원'} 님의 워케이션 여정을 관리하세요.
        </PageDesc>

        {/* 프로필 영역 */}
        <TopSection>
          <ProfileCard>
            <ProfileLeft>
              <AvatarBox>
                <ProfileAvatar
                  name={memberInfo?.name || ''}
                  profileImageUrl={memberInfo?.profileImageUrl || null}
                />
              </AvatarBox>

              <ProfileInfo>
                <UserName>{memberInfo?.name || '이름 없음'}</UserName>
                <UserSubTitle>Remote Explorer</UserSubTitle>

                <BadgeArea>
                  {/* 관리하지 않는 등급 배지는 삭제 처리를 완료했습니다. ✨ */}
                  <JoinDate>{formatDate(memberInfo?.joinDate)} 가입</JoinDate>
                </BadgeArea>

                <StatRow>
                  <StatItem>
                    {/* 백엔드 DTO: totalWorkationDays 동적 바인딩 */}
                    <strong>{dashboardData?.totalWorkationDays || 0}일</strong>
                    <span>올해 워케이션</span>
                  </StatItem>

                  <StatItem>
                    {/* 백엔드 DTO: visitedRegionsCount 동적 바인딩 */}
                    <strong>{dashboardData?.visitedRegionsCount || 0}곳</strong>
                    <span>방문 지역</span>
                  </StatItem>

                  <StatItem>
                    {/* 백엔드 DTO: upcomingReservationsCount 동적 바인딩 */}
                    <strong>
                      {dashboardData?.upcomingReservationsCount || 0}건
                    </strong>
                    <span>예정 예약</span>
                  </StatItem>
                </StatRow>
              </ProfileInfo>
            </ProfileLeft>
          </ProfileCard>

          <RightQuickMenu>
            <QuickCard
              onClick={() => {
                navi(`/mypage/review`);
              }}
            >
              <Image size={20} />
              <QuickText>
                <strong>나의 리뷰</strong>
                <span>작성한 리뷰 보기</span>
              </QuickText>
            </QuickCard>

            <QuickCard
              onClick={() => {
                navi(`/mypage/wishlist`);
              }}
            >
              <Heart size={20} />
              <QuickText>
                <strong>찜한 숙소</strong>
                <span>저장한 공간 확인</span>
              </QuickText>
            </QuickCard>

            <WideCard
              onClick={() => {
                navi(`/mypage/coupon`);
              }}
            >
              <CouponLeft>
                <Wallet size={20} />
                <div>
                  {/* 백엔드 DTO: availableCouponCount 실시간 장수 연동 ✨ */}
                  <strong>
                    사용 가능한 쿠폰 {dashboardData?.availableCouponCount || 0}
                    장
                  </strong>
                  <p>이번 달 프로모션 쿠폰 포함</p>
                </div>
              </CouponLeft>
              <ChevronRight size={18} />
            </WideCard>
          </RightQuickMenu>
        </TopSection>

        {/* 예약 카드 영역 - 진행 중인 예약 유무에 따른 조건부 렌더링 최적화 */}
        <ReservationSection>
          <SectionTitle>
            <CalendarDays size={18} />
            현재 진행 중인 예약
          </SectionTitle>

          {!currentRes ? (
            <EmptyReservationBox>
              현재 진행 중인 워케이션 예약이 없습니다.
            </EmptyReservationBox>
          ) : (
            <ReservationCard>
              {/* 백엔드 S3 동적 썸네일 주소 바인딩 ✨ */}
              <ReservationImage
                src={currentRes.roomImageUrl}
                alt={currentRes.workspaceName}
              />

              <ReservationContent>
                {/* 백엔드 stayName -> workspaceName 명세 매핑 ✨ */}
                <ReservationTitle>{currentRes.workspaceName}</ReservationTitle>
                {/* 백엔드 stayService에서 조인해 온 룸 실이름 매핑 ✨ */}
                <ReservationSub>{currentRes.roomTypeName}</ReservationSub>

                <ReservationInfo>
                  <InfoItem>
                    <CalendarDays size={15} />
                    {formatDate(currentRes.startDate)} -{' '}
                    {formatDate(currentRes.endDate)}
                  </InfoItem>

                  <InfoItem>
                    <MapPin size={15} />
                    {/* 백엔드 spaceService에서 가져온 실제 주소 매핑 ✨ */}
                    {currentRes.locationAddress}
                  </InfoItem>
                </ReservationInfo>

                <ButtonArea>
                  <PrimaryButton>예약 상세 확인</PrimaryButton>
                  <SecondaryButton>예약 변경/취소</SecondaryButton>
                </ButtonArea>
              </ReservationContent>
            </ReservationCard>
          )}
        </ReservationSection>

        {/* 하단 카드 영역 - 지난 워케이션 다시 보기 리스트 동적 루프 구현 */}
        <BottomSection>
          <HistoryCard>
            <CardTitle>지난 워케이션 다시 보기</CardTitle>

            {pastWorkations.length === 0 ? (
              <EmptyHistoryText>
                이전 워케이션 히스토리가 존재하지 않습니다.
              </EmptyHistoryText>
            ) : (
              pastWorkations.map((history) => (
                <HistoryItem key={history.reservationId}>
                  <HistoryThumb
                    src={history.workspaceImageUrl}
                    alt={history.workspaceName}
                  />

                  <HistoryInfo>
                    <h4>{history.workspaceName}</h4>
                    <p>
                      {formatDate(history.startDate)} -{' '}
                      {formatDate(history.endDate)}
                    </p>
                  </HistoryInfo>

                  <ChevronRight size={18} />
                </HistoryItem>
              ))
            )}
          </HistoryCard>
        </BottomSection>
      </Main>
    </Container>
  );
}

export default MyPage;

/* ================= styled ================= */
// 작성해주신 아름다운 디자인 레이아웃을 완전히 보존하고, 예외 케이스(로딩/비어있음) 대응용 코드만 깔끔하게 추가했습니다.

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 160px);
  background-color: #f7f9fb;
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

// 기존 스타일 컴포넌트 정의 구역 확인용
const AvatarBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none; /* 👈 기존 회색/하늘색 배경색이 있었다면 제거 */
  border: none; /* 기존 테두리 제거 */
  /* 가로세로 크기는 ProfileAvatar 크기와 비슷하게 맞추거나 없애기 */
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

const JoinDate = styled.span`
  color: #94a3b8;
  font-size: 13px;
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
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ReservationImage = styled.img`
  width: 280px;
  height: 180px;
  border-radius: 18px;
  object-fit: cover;
  @media (max-width: 768px) {
    width: 100%;
  }
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
  flex-wrap: wrap;
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
  padding: 14px 30px;
  cursor: pointer;
  font-weight: 600;
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
  grid-template-columns: 1fr; /* 하단 카드 레이아웃 유연화 조정 */
  gap: 24px;
`;

const HistoryCard = styled.div`
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
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 14px;
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
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
    color: #374151;
  }

  p {
    color: #94a3b8;
    font-size: 13px;
  }
`;

/* ================= 새로 추가된 보조 스타일 컴포넌트 ================= */

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 160px);
  color: #64748b;
  font-size: 16px;
`;

const EmptyReservationBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
  border: 1px dashed #cbd5e1;
  border-radius: 18px;
  color: #94a3b8;
  font-size: 15px;
`;

const EmptyHistoryText = styled.p`
  color: #94a3b8;
  font-size: 14px;
  text-align: center;
  padding: 20px 0;
`;
