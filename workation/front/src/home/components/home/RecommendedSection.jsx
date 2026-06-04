import { useMemo } from 'react';
import styled from 'styled-components';
import SpaceCard from './SpaceCard';
import { RECOMMENDED_SPACES } from '../../data/homeData';
import useReveal from '../../../hooks/useReveal';

export default function RecommendedSection({ userProfile }) {
  const { ref, visible } = useReveal();

  // 1. 선호 지역 필터링 및 3개만 추출
  const recommendedList = useMemo(() => {
    let list = [...RECOMMENDED_SPACES];

    // 선호 지역이 있다면 필터링
    if (userProfile?.preferredArea) {
      list = list.filter(
        (space) => space.location === userProfile.preferredArea
      );
    }

    // 💡 3개만 잘라서 보여주기 (슬라이스)
    return list.slice(0, 3);
  }, [userProfile]);

  return (
    <Section ref={ref} $visible={visible}>
      <Header>
        <TitleGroup>
          <Label>당신을 위한 추천 워케이션</Label>
          <Desc>
            {userProfile?.preferredArea
              ? `${userProfile.preferredArea} 지역에서 업무 집중도를 극대화할 수 있는 곳을 엄선했습니다.`
              : '업무 집중도를 극대화할 수 있도록 엄선된 워케이션 장소입니다.'}
          </Desc>
        </TitleGroup>
      </Header>

      <Grid>
        {recommendedList.length > 0 ? (
          recommendedList.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))
        ) : (
          <EmptyMsg>해당 지역에 등록된 워케이션 장소가 없습니다.</EmptyMsg>
        )}
      </Grid>
    </Section>
  );
}

const EmptyMsg = styled.div`
  grid-column: span 3;
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

// ... 나머지 Styled Components는 이전과 동일
const SortTabs = styled.div`
  display: flex;
  gap: 16px;
  background: #f4f7f6;
  padding: 4px;
  border-radius: 8px;
`;

const Tab = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  background: ${({ $active }) => ($active ? '#ffffff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#3d646c' : '#888')};
  cursor: pointer;
  box-shadow: ${({ $active }) =>
    $active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'};
  transition: all 0.2s;
`;

// ... 나머지 기존 Styled Components 동일
/* ── Styled Components ── */

const Section = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 80px 32px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? 'translateY(0)' : 'translateY(20px)'};
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
