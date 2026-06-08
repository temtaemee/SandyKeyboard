// src/features/user/destination/api/destinationApi.js

import api from '../../../../app/api/axios';

/**
 * 1. 공개된 공간(Space) 목록 조건별 검색 조회
 */
export async function getPublicSpaceList(params) {
  // params 객체: { keyword, area, startDate, endDate, capacity, arcadeIds }
  const queryParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    if (params[key]) {
      // 배열(arcadeIds) 처리
      if (Array.isArray(params[key])) {
        params[key].forEach((val) => queryParams.append(key, val));
      } else {
        queryParams.append(key, params[key]);
      }
    }
  });

  const response = await api.get(`/public/space?${queryParams.toString()}`);
  return response.data;
}

/**
 * 2. 공개된 공간(Space) 단건 상세 조회
 */
export async function getPublicSpaceDetail(spaceId) {
  const response = await api.get(`/public/space/${spaceId}`);

  return response.data; // SpaceResDto 반환
}

/**
 * 3. 공개된 숙소(Stay) 단건 상세 조회
 */
export async function getPublicStayDetail(stayId) {
  const response = await api.get(`/public/stay/${stayId}`);
  return response.data; // StayResDto 반환
}
