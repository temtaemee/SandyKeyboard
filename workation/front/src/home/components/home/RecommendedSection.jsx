import styled from "styled-components";
import SpaceCard from "./SpaceCard";
import { RECOMMENDED_SPACES } from "../../data/homeData";
import useReveal from "../../hooks/useReveal";

export default function RecommendedSection() {
  const { ref, visible } = useReveal();

  return (
    <Section ref={ref} $visible={visible}>
      <Header>
        <TitleGroup>
          <Label>당신을 위한 추천 워케이션</Label>
          <Desc>
            업무 집중도를 극대화할 수 있도록 엄선된 워케이션 장소입니다.
          </Desc>
        </TitleGroup>
        <ViewAllLink href="#">
          전체 보기 <ChevronIcon />
        </ViewAllLink>
      </Header>

      <Grid>
        {RECOMMENDED_SPACES.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </Grid>
    </Section>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/* ── Styled Components ── */

const Section = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 80px 32px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(20px)"};
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const Label = styled.span`
  font-size: 16px;
  color: #3d646c;
  font-weight: 500;
`;

const Desc = styled.span`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ViewAllLink = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.primary};
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
`;
