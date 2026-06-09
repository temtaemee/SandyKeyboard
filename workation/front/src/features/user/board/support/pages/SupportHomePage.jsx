import { Outlet } from 'react-router-dom';
import { Wrapper, Title, TabContainer, Tab, Content } from '../styles/SupportHomePage.styles';

export default function SupportHomePage() {
  return (
    <Wrapper>
      <Title>고객지원</Title>

      <TabContainer>
        <Tab to="/notice">공지사항</Tab>
        <Tab to="/faq">FAQ</Tab>
      </TabContainer>

      <Content>
        <Outlet />
      </Content>
    </Wrapper>
  );
}
