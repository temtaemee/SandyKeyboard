import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

function PaymentFailPage() {
  const [searchParams] = useSearchParams();
  const message =
    searchParams.get('message') ||
    searchParams.get('code') ||
    '결제가 완료되지 않았습니다.';

  return (
    <Wrapper>
      <Panel>
        <Eyebrow>Payment Failed</Eyebrow>
        <Title>결제 처리에 실패했습니다.</Title>
        <Description>{message}</Description>
        <Actions>
          <PrimaryLink to="/resv/destination">숙소 다시 둘러보기</PrimaryLink>
          <SecondaryLink to="/mypage/reservation">예약 내역 확인</SecondaryLink>
        </Actions>
      </Panel>
    </Wrapper>
  );
}

export default PaymentFailPage;

const Wrapper = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 20px;
  background: ${({ theme }) => theme.colors.bg};
`;

const Panel = styled.section`
  width: min(100%, 520px);
  padding: 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.card};
  text-align: center;
`;

const Eyebrow = styled.p`
  margin: 0 0 10px;
  color: #c2410c;
  font-family: ${({ theme }) => theme.fonts.number};
  font-size: 13px;
  font-weight: 700;
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 28px;
  line-height: 1.35;
`;

const Description = styled.p`
  margin: 16px 0 0;
  color: ${({ theme }) => theme.colors.textMid};
  font-size: 16px;
  line-height: 1.6;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 28px;
  flex-wrap: wrap;
`;

const PrimaryLink = styled(Link)`
  min-width: 150px;
  padding: 12px 18px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  text-decoration: none;
`;

const SecondaryLink = styled(Link)`
  min-width: 150px;
  padding: 12px 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textDark};
  font-weight: 700;
  text-decoration: none;
`;
