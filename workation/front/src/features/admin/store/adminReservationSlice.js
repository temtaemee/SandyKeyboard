import { createSlice } from '@reduxjs/toolkit';

const adminReservationSlice = createSlice({
  name: 'adminReservation',
  initialState: {
    partners: [],
    reservations: [],
    reservationsTotalPage: 1,
    reservationsTotalCount: 0,
    allReservations: [],   // 통계/환불 모달용 전체 데이터
    loading: false,
    error: null,
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
    addPartner(state, action) {
      state.partners.unshift(action.payload);
    },
    updatePartner(state, action) {
      const { id, changes } = action.payload;
      const partner = state.partners.find((p) => p.id === id);
      if (partner) Object.assign(partner, changes);
    },
    togglePartnerStatus(state, action) {
      const id = action.payload;
      const partner = state.partners.find((p) => p.id === id);
      if (partner) {
        partner.status = partner.status === 'active' ? 'inactive' : 'active';
      }
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setReservations,
  setReservationsMetadata,
  setAllReservations,
  setPartners,
  addPartner,
  updatePartner,
  togglePartnerStatus,
  setLoading,
  setError,
} = adminReservationSlice.actions;

export default adminReservationSlice.reducer;
