import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import KoreaMap from './KoreaMap';

export default function HeroSection() {
  const navigate = useNavigate();

  const AREA_MAP = {
    서울특별시: 'SEOUL',
    경기도: 'GYEONGGI',
    강원도: 'GANGWON',
    충청남도: 'CHUNGNAM',
    충청북도: 'CHUNGBUK',
    경상남도: 'GYEONGNAM',
    경상북도: 'GYEONGBUK',
    전라남도: 'JEONNAM',
    전라북도: 'JEONBUK',
    제주특별자치도: 'JEJU',
  };

  const handleAreaClick = (areaCode) => {
    // areaCode는 이미 'GYEONGBUK' 같은 값입니다.
    if (areaCode) {
      navigate(`/resv/destination?area=${areaCode}`);
    } else {
      alert(`해당 지역은 아직 연결되지 않은 지역입니다.`);
    }
  };

  return (
    <Section>
      <Overlay />
      <Container>
        <Title>워케이션 지도</Title>
        <Subtitle>
          원하는 지역을 클릭하여 업무와 휴식을 동시에 즐겨보세요.
        </Subtitle>

        <MapArea>
          <KoreaMap onSelectArea={handleAreaClick} />
        </MapArea>
      </Container>
    </Section>
  );
}

/* ── Styled Components (필수) ── */
const Section = styled.section`
  height: 870px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.gradients.hero};
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.08);
  pointer-events: none;
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1280px;
  width: 100%;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 64px;
  font-weight: 500;
  color: white;
  text-align: center;
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: white;
  text-align: center;
  margin-bottom: 48px;
`;

const MapArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
