import { useState, useEffect } from 'react';
import styled from 'styled-components';
import SpaceCard from './SpaceCard';
import useReveal from '../../../hooks/useReveal';
import axios from 'axios';
import api from '../../../app/api/axios';

export default function RecommendedSection({ userProfile }) {
  const { ref, visible } = useReveal();
  const [recommendedList, setRecommendedList] = useState([]);

  useEffect(() => {
    // API 호출
    const fetchRecommended = async () => {
      try {
        // userProfile이 있을 때만 쿼리 파라미터 추가
        const params = userProfile?.preferredArea
          ? { area: userProfile.preferredArea }
          : {};

        const response = await api.get('/public/space/list/recommended', {
          params,
        });

        setRecommendedList(response.data);
      } catch (error) {
        console.error('추천 데이터 로드 실패', error);
      }
    };

    fetchRecommended();
  }, [userProfile]);

  return (
    <Section ref={ref} $visible={visible}>
      {/* ... 기존 JSX 동일 ... */}
      <Header>
        <TitleGroup>
          <Label>당신을 위한 추천 워케이션</Label>
          <Desc>
            {userProfile?.preferredArea
              ? `${userProfile.preferredArea} 지역에서 평점이 높고 리뷰가 활발한 장소를 엄선했습니다.`
              : '평점 4.0 이상, 가장 활발한 워케이션 장소입니다.'}
          </Desc>
        </TitleGroup>
      </Header>

      <Grid>
        {recommendedList.length > 0 ? (
          recommendedList.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))
        ) : (
          <EmptyMsg>조건에 맞는 추천 장소가 없습니다.</EmptyMsg>
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
  grid-template-columns: repeat(3, 1fr); // 3개씩 정렬
  gap: 32px;

  // 💡 6개가 되었을 때 줄바꿈이 자연스럽게 되도록 설정
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr); // 태블릿에서는 2개씩 3줄
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr); // 모바일에서는 1개씩 6줄
  }
`;
