import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Annotation,
} from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import styled from 'styled-components';
import { Marker } from 'react-simple-maps';

const GEO_URL =
  'https://raw.githubusercontent.com/southkorea/southkorea-maps/master/kostat/2013/json/skorea_provinces_geo.json';

// 중복 선언을 제거하고 모든 지역을 포함한 하나의 객체로 통합
const AREA_GROUP_MAP = {
  서울특별시: 'SEOUL',
  경기도: 'GYEONGGI',
  인천광역시: 'GYEONGGI',
  강원도: 'GANGWON',
  충청남도: 'CHUNGNAM',
  대전광역시: 'CHUNGNAM',
  세종특별자치시: 'CHUNGNAM',
  충청북도: 'CHUNGBUK',
  경상남도: 'GYEONGNAM',
  부산광역시: 'GYEONGNAM',
  울산광역시: 'GYEONGNAM',
  경상북도: 'GYEONGBUK',
  대구광역시: 'GYEONGBUK',
  전라남도: 'JEONNAM',
  광주광역시: 'JEONNAM',
  전라북도: 'JEONBUK',
  제주특별자치도: 'JEJU',
};

const KoreaMap = ({ onSelectArea }) => {
  return (
    <MapWrapper>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 6400, center: [127.8, 35.8] }}
        width={800}
        height={700}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const centroid = geoCentroid(geo);
              const name = geo.properties.name;
              const groupName = AREA_GROUP_MAP[name];
              const isAllowed = !!groupName;

              // 라벨을 표시할 대상 (도 단위 대표 지역들만)
              const isLabelTarget = [
                '서울특별시',
                '경기도',
                '강원도',
                '충청남도',
                '충청북도',
                '경상남도',
                '경상북도',
                '전라남도',
                '전라북도',
                '제주특별자치도',
              ].includes(name);

              return (
                <React.Fragment key={geo.rsmKey}>
                  <StyledGeography
                    geography={geo}
                    $isAllowed={isAllowed}
                    // 그룹 이름(코드값)을 직접 넘깁니다.
                    onClick={() => isAllowed && onSelectArea(groupName)}
                  />

                  {/* 1. 라벨 대상 지역일 때만 표시 */}
                  {isLabelTarget && (
                    <Annotation
                      subject={centroid}
                      dx={
                        name === '서울특별시' ? -15 : name === '경기도' ? 25 : 0
                      }
                      dy={
                        name === '서울특별시' ? -5 : name === '경기도' ? 10 : 0
                      }
                      connectorProps={{ display: 'none' }}
                    >
                      {/* 2. AREA_GROUP_MAP[name]을 사용하여 약어 표시 */}
                      <LabelText>{groupName}</LabelText>
                    </Annotation>
                  )}
                </React.Fragment>
              );
            })
          }
        </Geographies>
        {/* 독도 마커 추가 */}
        {/* 경도 값을 129.5에서 130.0 또는 130.5로 키우면 동쪽으로 이동합니다 */}
        <Marker coordinates={[131.1, 37.3]}>
          <circle r={4} fill="#2c6480" stroke="#FFFFFF" strokeWidth={1} />
          <text
            textAnchor="start"
            x={8}
            y={4}
            style={{
              fontSize: '12px',
              fill: '#2c6480',
              fontWeight: 'bold',
              filter: 'drop-shadow(0px 1px 2px rgba(255, 255, 255, 0.8))',
            }}
          ></text>
        </Marker>
      </ComposableMap>
    </MapWrapper>
  );
};

const StyledGeography = styled(Geography)`
  /* 워케이션 브랜드 컬러 적용 */
  fill: ${({ theme, $isAllowed }) =>
    $isAllowed ? theme.colors.primary : theme.colors.borderLight};

  /* 경계선(stroke)을 조건부로 투명하게 만듦 */
  stroke: ${({ theme, name }) =>
    [
      '인천광역시',
      '부산광역시',
      '대구광역시',
      '대전광역시',
      '광주광역시',
      '울산광역시',
      '세종특별자치시',
    ].includes(name)
      ? 'transparent'
      : theme.colors.white};

  stroke-width: ${({ name }) =>
    [
      '인천광역시',
      '부산광역시',
      '대구광역시',
      '대전광역시',
      '광주광역시',
      '울산광역시',
      '세종특별자치시',
    ].includes(name)
      ? 0
      : 0};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: ${({ $isAllowed }) => ($isAllowed ? 'pointer' : 'default')};

  &:hover {
    fill: ${({ theme, $isAllowed }) =>
      $isAllowed ? theme.colors.primaryLight : theme.colors.borderLight};
    stroke-width: 2;
  }
`;

const LabelText = styled.text`
  font-size: 14px;
  fill: ${({ theme }) => theme.colors.white};
  font-weight: 700;
  text-anchor: middle;
  pointer-events: none;
  /* 가독성을 위한 그림자 효과 */
  filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.3));
  letter-spacing: -0.5px;
`;

const MapWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  /* 지도 전체에 부드러운 그림자 추가 */
  svg {
    display: block;
    filter: drop-shadow(0 20px 25px -5px rgba(44, 100, 128, 0.2));
  }
`;

export default KoreaMap;
