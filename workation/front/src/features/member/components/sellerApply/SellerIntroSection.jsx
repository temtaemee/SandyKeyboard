import styled from 'styled-components';

function SellerIntroSection() {
  return (
    <Wrapper>
      <Badge>Host Partner</Badge>
      <Title>
        비어있는 공간을
        <br />
        가장 가치 있게.
      </Title>

      <Description>
        전국의 워케이션 유저들이 당신의 공간을 기다리고 있습니다.
        <br />
        간편한 숙소 등록만으로 공실 문제를 해결하고
        <br />
        새로운 수익 창출의 기회를 만나보세요.
      </Description>

      <FeatureList>
        <FeatureCard>
          <Icon>💰</Icon>
          <FeatureText>월 평균 수익 25% 상승</FeatureText>
        </FeatureCard>

        <FeatureCard>
          <Icon>📊</Icon>
          <FeatureText>실시간 예약 관리 시스템</FeatureText>
        </FeatureCard>

        <FeatureCard>
          <Icon>🤝</Icon>
          <FeatureText>워케이션 커뮤니티 연결</FeatureText>
        </FeatureCard>
      </FeatureList>
    </Wrapper>
  );
}

export default SellerIntroSection;

const Wrapper = styled.section`
  flex: 1;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  background-color: #e8eff1;
  color: #4d6c75;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 58px;
  line-height: 1.2;
  font-weight: 700; // 판매자용은 조금 더 신뢰감 있게 두께를 줌
  color: #3d4d54;
  margin-bottom: 28px;

  @media screen and (max-width: 768px) {
    font-size: 40px;
  }
`;

const Description = styled.p`
  font-size: 18px;
  line-height: 1.8;
  color: #65808a;
  margin-bottom: 48px;
`;

const FeatureList = styled.div`
  display: flex;
  flex-wrap: wrap; // 모바일 대응을 위해 wrap 추가
  gap: 16px;
`;

const FeatureCard = styled.div`
  min-width: 180px;
  height: 90px;
  background-color: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid #f0f3f5; // 살짝 테두리를 주어 고급스럽게 변경
`;

const Icon = styled.div`
  font-size: 20px;
  margin-bottom: 6px;
`;

const FeatureText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #5c6f77;
`;
