import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';

export default function SupportHomePage() {
  return (
    <Wrapper>
      <Title>고객지원</Title>

      <TabContainer>
        <Tab to="/board/notice">공지사항</Tab>
        <Tab to="/board/faq">FAQ</Tab>
      </TabContainer>

      <Content>
        <Outlet />
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 40px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 14px;
  margin-bottom: 40px;
`;

const Tab = styled(NavLink)`
  padding: 12px 24px;
  border-radius: 999px;
  text-decoration: none;
  background: #f3f4f6;
  color: #333;
  font-weight: 600;

  &.active {
    background: black;
    color: white;
  }
`;

const Content = styled.div``;
