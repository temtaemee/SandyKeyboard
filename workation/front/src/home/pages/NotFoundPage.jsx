import { Link } from 'react-router-dom';
import styled from 'styled-components';

function NotFoundPage() {
  return (
    <Wrapper>
      <Panel>
        <Code>404</Code>
        <Title>페이지를 찾을 수 없습니다.</Title>
        <Description>
          주소가 바뀌었거나 더 이상 제공되지 않는 페이지입니다.
        </Description>
        <Actions>
          <PrimaryLink to="/">홈으로 이동</PrimaryLink>
          <SecondaryLink to="/resv/destination">숙소 둘러보기</SecondaryLink>
        </Actions>
      </Panel>
    </Wrapper>
  );
}

export default NotFoundPage;

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

const Code = styled.p`
  margin: 0 0 8px;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.number};
  font-size: 15px;
  font-weight: 800;
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
  min-width: 140px;
  padding: 12px 18px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  text-decoration: none;
`;

const SecondaryLink = styled(Link)`
  min-width: 140px;
  padding: 12px 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textDark};
  font-weight: 700;
  text-decoration: none;
`;
