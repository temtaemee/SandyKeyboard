import { Outlet } from 'react-router-dom';
import { Wrapper, Title, TabContainer, Tab } from '../styles/ReviewHomePage.styles';

export default function ReviewHomePage() {
  return (
    <Wrapper>
      <Title>참여후기</Title>

      <TabContainer>
        <Tab to="/board/review" end>후기 목록</Tab>
        <Tab to="/board/review/write">후기 작성</Tab>
      </TabContainer>

      <Outlet />
    </Wrapper>
  );
}
