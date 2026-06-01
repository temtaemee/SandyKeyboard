// src/features/user/destination/api/destinationApi.js

import api from '../../../../app/api/axios';

/**
 * 1. 공개된 공간(Space) 목록 조건별 검색 조회
 */
export async function getPublicSpaceList(keyword, area) {
  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append('keyword', keyword);
  if (area) queryParams.append('area', area);

  const response = await api.get(`/public/space?${queryParams.toString()}`);
  return response.data; // List<SpaceResDto> 반환
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
