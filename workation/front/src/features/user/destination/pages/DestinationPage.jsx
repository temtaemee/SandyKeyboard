import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import useDestination from '../hooks/useDestination';
import { useSearchParams } from 'react-router-dom';
import api from '../../../../app/api/axios';

const AREA_LIST = [
  { label: '전체', value: '' },
  { label: '서울', value: 'SEOUL' },
  { label: '경기', value: 'GYEONGGI' },
  { label: '강원', value: 'GANGWON' },
  { label: '경남', value: 'GYEONGNAM' },
  { label: '경북', value: 'GYEONGBUK' },
  { label: '충남', value: 'CHUNGNAM' },
  { label: '충북', value: 'CHUNGBUK' },
  { label: '전남', value: 'JEONNAM' },
  { label: '전북', value: 'JEONBUK' },
  { label: '제주', value: 'JEJU' },
];

function DestinationPage() {
  const [searchParams] = useSearchParams();
  const { spaces = [], loadSpaces, loading } = useDestination();
  const [allArcades, setAllArcades] = useState([]);

  useEffect(() => {
    api
      .get('/public/arcade') // 👈 실제 백엔드 ArcadePublicApiController 경로로 수정하세요
      .then((res) => {
        setAllArcades(res.data);
      })
      .catch((err) => {
        console.error('편의시설 목록 로드 실패:', err);
      });
  }, []);

  // 필터 상태 통합 관리
  const [filters, setFilters] = useState({
    keyword: '',
    area: searchParams.get('area') || '',
    startDate: '',
    endDate: '',
    arcadeIds: [], // 💡 편의시설 ID 배열 상태 추가
  });

  // 2. 토글 함수
  const toggleArcade = (id) => {
    setFilters((prev) => {
      const isSelected = prev.arcadeIds.includes(id);
      return {
        ...prev,
        arcadeIds: isSelected
          ? prev.arcadeIds.filter((item) => item !== id)
          : [...prev.arcadeIds, id],
      };
    });
  };

  // URL area 파라미터 변경 시 동기화
  useEffect(() => {
    setFilters((prev) => ({ ...prev, area: searchParams.get('area') || '' }));
  }, [searchParams]);

  // 필터 변경 시마다 자동 검색 (혹은 필요시 검색 버튼 클릭 시에만 호출하도록 변경 가능)
  useEffect(() => {
    loadSpaces({
      keyword: filters.keyword,
      area: filters.area,
      startDate: filters.startDate,
      endDate: filters.endDate,
      arcadeIds: filters.arcadeIds, // 💡 배열 전달
    });
  }, [filters.area, filters.keyword, filters.arcadeIds]); // 💡 arcadeIds 감시 추가

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadSpaces(filters); // 💡 filters 객체 전체 전달
  };

  return (
    <Wrapper>
      <HeaderBanner>
        <BannerTitle>원하는 워케이션 목적지를 찾아보세요</BannerTitle>
        <BannerDesc>
          최적의 몰입 환경과 재충전이 준비된 전국 각지의 공간들입니다.
        </BannerDesc>
      </HeaderBanner>

      <FilterContainer>
        <SearchForm onSubmit={handleSearchSubmit}>
          <SearchInput
            type="text"
            placeholder="공간 명칭이나 키워드를 검색하세요..."
            value={filters.keyword}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, keyword: e.target.value }))
            }
          />
          <DateInput
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
          <DateInput
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />

          <SearchButton type="submit">검색</SearchButton>
        </SearchForm>

        <ArcadeButtonGroup>
          {/* 예시: API로 전체 편의시설 목록을 받아와서 렌더링하세요 */}
          {allArcades.map((arcade) => (
            <ArcadeButton
              key={arcade.id}
              $active={filters.arcadeIds.includes(arcade.id)}
              onClick={() => toggleArcade(arcade.id)}
            >
              {arcade.name}
            </ArcadeButton>
          ))}
        </ArcadeButtonGroup>
        <AreaButtonGroup>
          {AREA_LIST.map((area) => (
            <AreaButton
              key={area.value}
              active={filters.area === area.value}
              onClick={() =>
                setFilters((prev) => ({ ...prev, area: area.value }))
              }
            >
              {area.label}
            </AreaButton>
          ))}
        </AreaButtonGroup>
      </FilterContainer>

      <MainContentSection>
        <ResultHeader>
          총 <CountText>{spaces.length}</CountText>개의 워케이션 공간이
          있습니다.
        </ResultHeader>

        {loading ? (
          <LoadingText>
            📡 최적의 워케이션 인프라를 불러오는 중입니다...
          </LoadingText>
        ) : spaces.length === 0 ? (
          <EmptyWrapper>
            <EmptyText>
              🔍 조건에 매칭되는 워케이션 공간이 아직 등록되지 않았습니다.
            </EmptyText>
          </EmptyWrapper>
        ) : (
          <GridContainer>
            {spaces.map((space) => {
              const SERVER_HOST = 'http://localhost:80';
              const finalThumb = space.thumbnailUrl
                ? space.thumbnailUrl.startsWith('http')
                  ? space.thumbnailUrl
                  : `${SERVER_HOST}${space.thumbnailUrl}`
                : 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80';

              return (
                <SpaceCard
                  key={space.id}
                  onClick={() =>
                    (window.location.href = `/resv/space/${space.id}`)
                  }
                >
                  <ThumbnailBox>
                    <img src={finalThumb} alt={space.name} />
                    <AreaBadge>{space.area}</AreaBadge>
                  </ThumbnailBox>
                  <CardBody>
                    <SpaceTitle>{space.name}</SpaceTitle>
                    <SpaceSummary>{space.summary}</SpaceSummary>
                    <SpaceAddress>{space.address1}</SpaceAddress>
                    <CardFooter>
                      <DetailButton>자세히 보기 &rarr;</DetailButton>
                    </CardFooter>
                  </CardBody>
                </SpaceCard>
              );
            })}
          </GridContainer>
        )}
      </MainContentSection>
    </Wrapper>
  );
}

export default DestinationPage;

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  display: flex;
  flex-direction: column;
`;
const HeaderBanner = styled.div`
  width: 100%;
  padding: 60px 24px;
  background: ${({ theme }) => theme.gradients.hero};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 8px;
`;
const BannerTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.base};
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textDark};
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;
const BannerDesc = styled.p`
  font-family: ${({ theme }) => theme.fonts.base};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMid};
`;
const FilterContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: -30px auto 0 auto;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadows.searchBar};
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const SearchForm = styled.form`
  display: flex;
  gap: 12px;
  width: 100%;
`;
const SearchInput = styled.input`
  flex: 1;
  height: 52px;
  padding: 0 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.fonts.base};
  font-size: 16px;
  outline: none;
  transition: all 0.2s ease;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
const SearchButton = styled.button`
  padding: 0 32px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.fonts.base};
  font-size: 16px;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: all 0.2s ease;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;
const AreaButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;
const AreaButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop),
})`
  padding: 10px 24px;
  border-radius: ${({ theme }) => theme.radius.full};
  /* ... 기존 스타일 ... */
  border: 1px solid
    ${(props) =>
      props.active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${(props) =>
    props.active ? props.theme.colors.primary : props.theme.colors.white};
  color: ${(props) =>
    props.active ? props.theme.colors.white : props.theme.colors.textMid};
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: all 0.2s ease;
  &:hover {
    background: ${(props) =>
      props.active
        ? props.theme.colors.primary
        : props.theme.colors.borderLight};
    color: ${(props) =>
      props.active ? props.theme.colors.white : props.theme.colors.textDark};
  }
`;
const MainContentSection = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px 80px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const ResultHeader = styled.div`
  font-family: ${({ theme }) => theme.fonts.base};
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMid};
`;
const CountText = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
`;
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
const SpaceCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    transform: translateY(-6px);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
    border-color: ${({ theme }) => theme.colors.primaryLight};
  }
`;
const ThumbnailBox = styled.div`
  width: 100%;
  height: 220px;
  background: ${({ theme }) => theme.colors.borderLight};
  position: relative;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const AreaBadge = styled.span`
  position: absolute;
  top: 14px;
  left: 14px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.full};
`;
const NoImageText = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 13px;
`;
const CardBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const SpaceTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const SpaceSummary = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMid};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const SpaceAddress = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;
const CardFooter = styled.div`
  margin-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding-top: 12px;
  display: flex;
  justify-content: flex-end;
`;
const DetailButton = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  &:hover {
    color: ${({ theme }) => theme.colors.primaryLight};
  }
`;
const EmptyWrapper = styled.div`
  width: 100%;
  padding: 100px 0;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;
const EmptyText = styled.p`
  text-align: center;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textLight};
`;
const LoadingText = styled.div`
  text-align: center;
  padding: 60px 0;
  font-size: 16px;
  color: #64748b;
  font-weight: 600;
`;
const DateInput = styled.input`
  height: 52px;
  padding: 0 15px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.fonts.base};
  color: ${({ theme }) => theme.colors.textMid};
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
const ArcadeButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const ArcadeButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['active'].includes(prop),
})`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid
    ${(props) =>
      props.$active ? props.theme.colors.primary : props.theme.colors.border};
  background: ${(props) =>
    props.$active ? props.theme.colors.primary : 'white'};
  color: ${(props) => (props.$active ? 'white' : props.theme.colors.textMid)};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.base};
  font-size: 14px;
  transition: all 0.2s ease;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
