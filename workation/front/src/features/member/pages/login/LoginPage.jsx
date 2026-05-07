// LoginPage.jsx
import styled from "styled-components";
import LoginForm from "./../../components/login/LoginForm";

function LoginPage() {
  return (
    <Wrapper>
      <LoginForm />
    </Wrapper>
  );
}

export default LoginPage;

const Wrapper = styled.main`
  width: 100%;
  min-height: calc(100vh - 160px);
  background-color: #f4f7f8;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 60px 20px;
`;
