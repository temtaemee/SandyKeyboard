// src/features/reservation/slice/ReservationSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reservationList: [],
  reservationDetail: null,
  loading: false,
  error: null,
};

const reservationSlice = createSlice({
  name: 'reservation',

  initialState,

  reducers: {
    // 예약 목록 저장
    setReservationList(state, action) {
      state.reservationList = action.payload;
    },

    // 예약 상세 저장
    setReservationDetail(state, action) {
      state.reservationDetail = action.payload;
    },

    // 로딩 처리
    setLoading(state, action) {
      state.loading = action.payload;
    },

    // 에러 처리
    setError(state, action) {
      state.error = action.payload;
    },

    // 상세 초기화
    clearReservationDetail(state) {
      state.reservationDetail = null;
    },
  },
});

export const {
  setReservationList,
  setReservationDetail,
  setLoading,
  setError,
  clearReservationDetail,
} = reservationSlice.actions;

export default reservationSlice.reducer;
