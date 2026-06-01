import { createSlice } from '@reduxjs/toolkit';

const adminReservationSlice = createSlice({
  name: 'adminReservation',
  initialState: {
    partners: [],
    reservations: [],
    reservationsTotalPage: 1,
    reservationsTotalCount: 0,
    allReservations: [], // 통계/환불 모달용 전체 데이터
    loading: false,
    error: null,
    dashboardSummary: {
      thisMonthReservationCount: 0,
      thisMonthCancelAmount: 0,
    },
  },
  reducers: {
    setReservations(state, action) {
      state.reservations = action.payload;
    },
    setReservationsMetadata(state, action) {
      const { totalPage, totalCount } = action.payload;
      state.reservationsTotalPage = totalPage;
      state.reservationsTotalCount = totalCount;
    },
    setAllReservations(state, action) {
      state.allReservations = action.payload;
    },
    setPartners(state, action) {
      state.partners = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setDashboardSummary(state, action) {
      state.dashboardSummary = action.payload;
    },
  },
});

export const {
  setReservations,
  setReservationsMetadata,
  setAllReservations,
  setPartners,
  setLoading,
  setError,
  setDashboardSummary,
} = adminReservationSlice.actions;

export default adminReservationSlice.reducer;
