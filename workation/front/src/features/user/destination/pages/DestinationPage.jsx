import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import useDestination from '../hooks/useDestination';
import { useSearchParams } from 'react-router-dom';
import api from '../../../../app/api/axios';
import { resolveAssetUrl } from '../../../../app/config/env';

// 💡 1. react-datepicker 및 한국어 로캘 임포트
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

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
      .get('/public/arcade')
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
    arcadeIds: [],
  });

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

  //URL area 파라미터 변경 시 동기화
  useEffect(() => {
    setFilters((prev) => ({ ...prev, area: searchParams.get('area') || '' }));
  }, [searchParams]);

  // 필터 변경 시마다 자동 검색
  useEffect(() => {
    loadSpaces({
      keyword: filters.keyword,
      area: filters.area,
      startDate: filters.startDate,
      endDate: filters.endDate,
      arcadeIds: filters.arcadeIds,
    });
  }, [filters.area, filters.keyword, filters.arcadeIds]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadSpaces(filters);
    setFilters((prev) => ({
      ...prev,
      startDate: '',
      endDate: '',
    }));
  };

  // 💡 2. Date 객체를 'YYYY-MM-DD' 문자열로 포맷팅하는 헬퍼 함수
  const formatDateString = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

          {/* 💡 3. 체크인 날짜 DatePicker 설정 */}
          <DatePickerWrapper>
            <StyledDatePicker
              locale={ko}
              dateFormat="yyyy-MM-dd"
              placeholderText="체크인 날짜"
              selected={filters.startDate ? new Date(filters.startDate) : null}
              minDate={new Date()} // 오늘 이전 날짜 선택 불가
              onChange={(date) => {
                const formatted = formatDateString(date);
                setFilters((prev) => {
                  // 체크인을 바꿨을 때, 기존 체크아웃 날짜가 더 전날이 된다면 체크아웃을 초기화합니다.
                  const nextEndDate =
                    prev.endDate && new Date(prev.endDate) < date
                      ? ''
                      : prev.endDate;
                  return {
                    ...prev,
                    startDate: formatted,
                    endDate: nextEndDate,
                  };
                });
              }}
            />
          </DatePickerWrapper>

          {/* 💡 4. 체크아웃 날짜 DatePicker 설정 */}
          <DatePickerWrapper>
            <StyledDatePicker
              locale={ko}
              dateFormat="yyyy-MM-dd"
              placeholderText="체크아웃 날짜"
              selected={filters.endDate ? new Date(filters.endDate) : null}
              // 핵심 기능: 체크인이 선택되어 있다면 [체크인 당일] 혹은 [체크인 + 1일]부터 선택 가능하게 설정
              minDate={
                filters.startDate
                  ? new Date(
                      new Date(filters.startDate).setDate(
                        new Date(filters.startDate).getDate() + 1
                      )
                    )
                  : new Date()
              }
              disabled={!filters.startDate} // 체크인을 먼저 선택하도록 유도할 경우 활성화 (선택 사항)
              onChange={(date) =>
                setFilters((prev) => ({
                  ...prev,
                  endDate: formatDateString(date),
                }))
              }
            />
          </DatePickerWrapper>

          <SearchButton type="submit">검색</SearchButton>
        </SearchForm>

        <ArcadeButtonGroup>
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
              const finalThumb = space.thumbnailUrl
                ? resolveAssetUrl(space.thumbnailUrl)
                : resolveAssetUrl('/dummy-images/gangwon/hotel1/강원1외관.png');

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

/* ========================================================================= */
/* Styled Components 추가 및 변경                                            */
/* ========================================================================= */

// 💡 5. SearchForm의 flex 배치 레이아웃이 깨지지 않게 유연한 폭을 제공하는 래퍼 추가
const DatePickerWrapper = styled.div`
  flex: 1;
  min-width: 150px;
  .react-datepicker-wrapper {
    width: 100%;
  }
`;

// 기존 DateInput 스타일 구조를 캘린더 컴포넌트에 이식
const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  height: 52px;
  padding: 0 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.fonts.base};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMid};
  outline: none;
  transition: all 0.2s ease;
  background-color: #fff;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    background-color: #f1f5f9;
    cursor: not-allowed;
  }
`;

/* 기존 스타일 하단부 유지 */
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
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const SearchInput = styled.input`
  flex: 2;
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
  height: 52px;
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
