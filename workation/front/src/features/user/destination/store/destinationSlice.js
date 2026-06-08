// src/features/user/destination/store/destinationSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  spaces: [], // 전체/필터링된 공간 목록
  currentSpace: null, // 현재 조회 중인 공간 상세 데이터
  currentStay: null, // 현재 조회 중인 숙소 상세 데이터
  loading: false,
  error: null,
};

const destinationSlice = createSlice({
  name: 'destination',
  initialState,
  reducers: {
    setSpaces: (state, action) => {
      state.spaces = action.payload;
    },
    setCurrentSpace: (state, action) => {
      state.currentSpace = action.payload;
    },
    setCurrentStay: (state, action) => {
      state.currentStay = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearDetails: (state) => {
      state.currentSpace = null;
      state.currentStay = null;
    },
  },
});

export const {
  setSpaces,
  setCurrentSpace,
  setCurrentStay,
  setLoading,
  setError,
  clearDetails,
} = destinationSlice.actions;

export default destinationSlice.reducer;
