import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export default function ReviewHomePage() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Title>참여후기</Title>

      <TabContainer>
        <Tab to="/board/review/list">후기 목록</Tab>
        <WriteButton onClick={() => navigate('/board/review/write')}>
          후기 작성
        </WriteButton>
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
  align-items: center;
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

const WriteButton = styled.button`
  padding: 12px 24px;
  border-radius: 999px;
  border: none;
  background: #f3f4f6;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #e5e7eb;
  }
`;

const Content = styled.div``;
