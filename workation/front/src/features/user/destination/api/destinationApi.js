import api from '../../../../app/api/axios';

/**
 * 공개된 공간(Space) 목록 조건별 검색 조회
 * @param {string} keyword - 검색 키워드 (선택)
 * @param {string} area - 지역 Enum 값 (SEOUL, BUSAN, JEJU 등) (선택)
 */
export async function getPublicSpaceList(keyword, area) {
  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append('keyword', keyword);
  if (area) queryParams.append('area', area);

  const response = await api.get(`/public/space?${queryParams.toString()}`);
  return response.data; // List<SpaceResDto> 반환
}
