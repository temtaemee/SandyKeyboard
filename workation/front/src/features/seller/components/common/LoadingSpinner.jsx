import styled, { keyframes } from 'styled-components';

const ACCENT = '#3ec9a7';

const SIZE_MAP = {
  sm: 20,
  md: 36,
  lg: 52,
};

/**
 * 로딩 스피너
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} centered
 */
export default function LoadingSpinner({ size = 'md', centered = false }) {
  const px = SIZE_MAP[size] ?? SIZE_MAP.md;
  return centered ? (
    <Center>
      <Spinner $size={px} />
    </Center>
  ) : (
    <Spinner $size={px} />
  );
}

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  border: 3px solid #e2e8f0;
  border-top-color: ${ACCENT};
  animation: ${spin} 0.7s linear infinite;
  flex-shrink: 0;
`;

const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  width: 100%;
`;
