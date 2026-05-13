import styled from 'styled-components';
import SellerApplyForm from '../../components/sellerApply/SellerApplyForm';
import SellerIntroSection from '../../components/sellerApply/SellerIntroSection';

function SellerApplyPage() {
  return (
    <Wrapper>
      <Container>
        <SellerIntroSection />
        <SellerApplyForm />
      </Container>
    </Wrapper>
  );
}

export default SellerApplyPage;

// SignupPage와 동일한 스타일
const Wrapper = styled.main`
  width: 100%;
  min-height: calc(100vh - 160px);
  background-color: #f4f7f8;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 40px;
`;

const Container = styled.div`
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
