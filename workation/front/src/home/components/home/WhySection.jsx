import styled from "styled-components";
import { FEATURES } from "../../data/homeData";
import useReveal from "../../hooks/useReveal";

const ICONS = {
  monitor: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2c6480"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  refresh: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2c6480"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a10 10 0 1 0 10 10" />
      <polyline points="22 2 22 8 16 8" />
      <path d="M22 2L12 12" />
    </svg>
  ),
  users: (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2c6480"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

export default function WhySection() {
  const { ref, visible } = useReveal();

  return (
    <Section>
      <Inner ref={ref} $visible={visible}>
        <SectionHeader>
          <SectionLabel>왜 모래묻은 키보드인가요?</SectionLabel>
          <SectionDesc>
            "일할 수 있는 곳, 쉬고 싶은 곳. 이제 같은 곳입니다."
          </SectionDesc>
        </SectionHeader>

        <Grid>
          {FEATURES.map((feat) => (
            <FeatureCard key={feat.id}>
              <IconWrap>{ICONS[feat.icon]}</IconWrap>
              <FeatureTitle>{feat.title}</FeatureTitle>
              <FeatureDesc>{feat.desc}</FeatureDesc>
            </FeatureCard>
          ))}
        </Grid>
      </Inner>
    </Section>
  );
}

/* ── Styled Components ── */

const Section = styled.section`
  background: ${({ theme }) => theme.colors.bgSection};
  padding: 80px 0;
`;

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  gap: 64px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(20px)"};
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const SectionLabel = styled.p`
  font-size: 16px;
  color: #3d646c;
  font-weight: 500;
  text-align: center;
`;

const SectionDesc = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  max-width: 672px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
`;

const FeatureCard = styled.div`
  background: white;
  border: 1px solid white;
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 33px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(44, 100, 128, 0.1);
  }
`;

const IconWrap = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.gradients.icon};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const FeatureTitle = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textDark};
  text-align: center;
  padding-top: 12px;
`;

const FeatureDesc = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  line-height: 1.6;
`;
