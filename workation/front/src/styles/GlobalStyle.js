import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.base};
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.textDark};
    line-height: 1.6;
    overflow-x: hidden;
  }

  button {
    cursor: pointer;
    font-family: ${({ theme }) => theme.fonts.base};
    border: none;
    background: none;
    padding: 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* 스크롤 reveal 애니메이션 */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export default GlobalStyle;
