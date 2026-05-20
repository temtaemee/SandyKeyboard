import styled from 'styled-components';
import SellerApplyForm from '../../components/sellerApply/SellerApplyForm';
import SellerIntroSection from '../../components/sellerApply/SellerIntroSection';
import MyPageSidebar from '../../../user/mypage/components/MyPageSidebar';

function SellerApplyPage() {
  return (
    <Container>
      <MyPageSidebar />

      <Main>
        <ContentWrapper>
          <SellerIntroSection />
          <SellerApplyForm />
        </ContentWrapper>
      </Main>
    </Container>
  );
}

export default SellerApplyPage;

const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 160px);
  background-color: #f4f7f8;
`;

const Main = styled.main`
  flex: 1;
  padding: 60px 40px;

  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1280px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 80px;

  @media screen and (max-width: 1024px) {
    flex-direction: column;
  }
`;
