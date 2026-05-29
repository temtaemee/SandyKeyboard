import { Outlet, useNavigate } from 'react-router-dom';
import { Wrapper, Title, TabContainer, Tab, WriteButton } from '../styles/ReviewHomePage.styles';

export default function ReviewHomePage() {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Title>참여후기</Title>

      <TabContainer>
        <Tab to="/board/review">후기 목록</Tab>
        <WriteButton onClick={() => navigate('/board/review/write')}>
          후기 작성
        </WriteButton>
      </TabContainer>

      <Outlet />
    </Wrapper>
  );
}
