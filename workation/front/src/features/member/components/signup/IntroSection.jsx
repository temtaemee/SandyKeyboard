// components/signup/IntroSection.jsx
import styled from "styled-components";

function IntroSection() {
  return (
    <Wrapper>
      <Title>
        바다를 보며
        <br />
        완성하는 오늘의 코드
      </Title>

      <Description>
        모래사장 위에서 펼쳐지는 가장 생산적인 시간.
        <br />
        전국 200여 개의 워케이션 스팟을 지금 바로 확인해보세요.
      </Description>

      <FeatureList>
        <FeatureCard>
          <Icon>✈</Icon>

          <FeatureText>전국 해변 스팟</FeatureText>
        </FeatureCard>

        <FeatureCard>
          <Icon>🏨</Icon>

          <FeatureText>고속 기가 와이파이</FeatureText>
        </FeatureCard>
      </FeatureList>
    </Wrapper>
  );
}

export default IntroSection;

const Wrapper = styled.section`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 64px;
  line-height: 1.2;
  font-weight: 300;

  color: #4d6c75;

  margin-bottom: 28px;

  @media screen and (max-width: 768px) {
    font-size: 42px;
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
  gap: 20px;
`;

const FeatureCard = styled.div`
  width: 190px;
  height: 86px;

  background-color: white;

  border-radius: 16px;

  padding: 18px;

  display: flex;
  flex-direction: column;
  justify-content: center;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
`;

const Icon = styled.div`
  font-size: 18px;
  margin-bottom: 8px;
`;

const FeatureText = styled.div`
  font-size: 14px;
  color: #5c6f77;
`;
