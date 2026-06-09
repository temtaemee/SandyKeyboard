// src/features/user/destination/hooks/useDestination.js

import { useDispatch, useSelector } from 'react-redux';
import {
  getPublicSpaceList,
  getPublicSpaceDetail,
  getPublicStayDetail,
} from '../api/destinationApi';
import {
  setSpaces,
  setCurrentSpace,
  setCurrentStay,
  setLoading,
  setError,
  clearDetails,
} from '../store/destinationSlice';

export default function useDestination() {
  const dispatch = useDispatch();

  // 💡 리덕스 스토어 상태 안전 조회 (초기값 방어선 구축)
  const destinationState = useSelector((state) => state.destination) || {};
  const spaces = destinationState.spaces || [];
  const currentSpace = destinationState.currentSpace || null;
  const currentStay = destinationState.currentStay || null;
  const loading = destinationState.loading || false;
  const error = destinationState.error || null;

  // 1. 공간 전체/필터 검색 통합 호출 훅
  const loadSpaces = async (params) => {
    dispatch(setLoading(true));
    try {
      // 💡 params가 객체(keyword, area, startDate, endDate, arcadeIds) 전체를 받도록 함
      const data = await getPublicSpaceList(params);
      dispatch(setSpaces(data || []));
    } catch (err) {
      console.error('loadSpaces 에러:', err);
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 2. 공간 상세 정보 로드 훅
  const loadSpaceDetail = async (spaceId) => {
    dispatch(setLoading(true));
    try {
      const data = await getPublicSpaceDetail(spaceId);
      dispatch(setCurrentSpace(data));
      return data;
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 3. 숙소 상세 정보 로드 훅
  const loadStayDetail = async (stayId) => {
    dispatch(setLoading(true));
    try {
      const data = await getPublicStayDetail(stayId);
      dispatch(setCurrentStay(data));
      return data;
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 4. 페이지 이탈 시 상세 데이터 초기화
  const resetDetails = () => {
    dispatch(clearDetails());
  };

  return {
    spaces,
    currentSpace,
    currentStay,
    loading,
    error,
    loadSpaces,
    loadSpaceDetail,
    loadStayDetail,
    resetDetails,
  };
}
