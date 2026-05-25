import { createSlice } from '@reduxjs/toolkit';
import { PARTNER_COMPANIES } from '../data/adminReservationData';

const adminReservationSlice = createSlice({
  name: 'adminReservation',
  initialState: {
    partners: PARTNER_COMPANIES,
    loading: false,
    error: null,
  },
  reducers: {
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
  setPartners,
  addPartner,
  updatePartner,
  togglePartnerStatus,
  setLoading,
  setError,
} = adminReservationSlice.actions;

export default adminReservationSlice.reducer;
