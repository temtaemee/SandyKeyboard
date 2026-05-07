// components/login/SocialLoginButtons.jsx
import styled from "styled-components";

function SocialLoginButtons() {
  return (
    <Wrapper>
      <SocialButton bg="#FEE500">🟨</SocialButton>

      <SocialButton bg="#03C75A">🟩</SocialButton>

      <SocialButton bg="#FFFFFF" border>
        🌐
      </SocialButton>
    </Wrapper>
  );
}

export default SocialLoginButtons;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 14px;
`;

const SocialButton = styled.button`
  width: 72px;
  height: 46px;

  border-radius: 10px;

  border: ${(props) => (props.border ? "1px solid #d1d5db" : "none")};

  background-color: ${(props) => props.bg};

  font-size: 18px;

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;
