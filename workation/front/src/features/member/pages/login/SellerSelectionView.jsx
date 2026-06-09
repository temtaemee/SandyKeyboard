import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import customerBg from '../../img/customer.png';
import sellerBg from '../../img/seller.png';

const SellerSelectionView = () => {
  const navigate = useNavigate();

  return (
    <SelectionContainer>
      <TitleArea>
        <MainTitle>어떤 모드로 이동할까요?</MainTitle>
        <SubTitle>
          워케이션 서비스를 이용하거나 판매자 센터를 관리할 수 있어요.
        </SubTitle>
      </TitleArea>

      <SelectionWrapper>
        {/* 판매자 */}
        <OptionBox onClick={() => navigate('/seller')}>
          <Overlay />

          <OptionImage src={sellerBg} alt="판매자 센터" />

          <Content>
            <Badge>SELLER MODE</Badge>

            <OptionTitle>판매자 센터</OptionTitle>

            <OptionDesc>
              숙소 등록, 예약 관리,
              <br />
              정산 및 운영 현황을 확인하세요.
            </OptionDesc>

            <MoveButton>판매자 센터 이동</MoveButton>
          </Content>
        </OptionBox>

        {/* 유저 */}
        <OptionBox onClick={() => navigate('/home')}>
          <Overlay />

          <OptionImage src={customerBg} alt="워케이션 홈 (소비자)" />

          <Content>
            <Badge>USER MODE</Badge>

            <OptionTitle>워케이션 홈</OptionTitle>

            <OptionDesc>
              새로운 워케이션 공간을 찾고
              <br />
              여행과 업무를 함께 즐겨보세요.
            </OptionDesc>

            <MoveButton>홈페이지 이동</MoveButton>
          </Content>
        </OptionBox>
      </SelectionWrapper>
    </SelectionContainer>
  );
};

export default SellerSelectionView;

/* ================= styled ================= */

const SelectionContainer = styled.main`
  min-height: calc(100vh - 140px);
  background-color: #f7f9fb;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 60px 40px;
`;

const TitleArea = styled.div`
  text-align: center;
  margin-bottom: 42px;
`;

const MainTitle = styled.h1`
  font-size: 42px;
  color: #374151;
  margin-bottom: 14px;
`;

const SubTitle = styled.p`
  font-size: 16px;
  color: #94a3b8;
`;

const SelectionWrapper = styled.div`
  width: 100%;
  max-width: 1400px;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const OptionBox = styled.div`
  position: relative;
  height: 620px;
  border-radius: 36px;
  overflow: hidden;
  cursor: pointer;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const OptionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;

  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.15));

  z-index: 1;
`;

const Content = styled.div`
  position: absolute;
  left: 40px;
  bottom: 42px;
  z-index: 2;

  color: white;
`;

const Badge = styled.div`
  width: fit-content;
  padding: 8px 14px;
  border-radius: 999px;

  background-color: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);

  font-size: 12px;
  font-weight: 600;

  margin-bottom: 18px;
`;

const OptionTitle = styled.h2`
  font-size: 42px;
  margin-bottom: 18px;
`;

const OptionDesc = styled.p`
  font-size: 16px;
  line-height: 1.7;

  color: rgba(255, 255, 255, 0.9);

  margin-bottom: 28px;
`;

const MoveButton = styled.div`
  width: fit-content;

  padding: 14px 24px;
  border-radius: 999px;

  background-color: white;
  color: #374151;

  font-size: 14px;
  font-weight: 600;
`;
