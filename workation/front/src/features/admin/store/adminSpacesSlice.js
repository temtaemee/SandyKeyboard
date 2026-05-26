import { createSlice } from '@reduxjs/toolkit';

const adminSpacesSlice = createSlice({
  name: 'adminSpaces',
  initialState: {
    spaces: [],
    pendingSpaces: [],
    rejectedSpaces: [],
    blindedIds: {},
    loading: false,
    error: null,
  },
  reducers: {
    setSpaces(state, action) {
      state.spaces = action.payload;
    },
    setPendingSpaces(state, action) {
      state.pendingSpaces = action.payload;
    },
    setBlinded(state, action) {
      const { id, blinded } = action.payload;
      state.blindedIds[id] = blinded;
    },
    approveSpaces(state, action) {
      const { ids, fromTab } = action.payload;
      const source = fromTab === 'pending' ? state.pendingSpaces : state.rejectedSpaces;
      const toApprove = source
        .filter((s) => ids.includes(s.id))
        .map((s) => ({ ...s, status: 'active' }));
      state.spaces = [...toApprove, ...state.spaces];
      if (fromTab === 'pending') {
        state.pendingSpaces = state.pendingSpaces.filter((s) => !ids.includes(s.id));
      } else {
        state.rejectedSpaces = state.rejectedSpaces.filter((s) => !ids.includes(s.id));
      }
    },
    rejectSpaces(state, action) {
      const ids = action.payload;
      const toReject = state.pendingSpaces.filter((s) => ids.includes(s.id));
      state.rejectedSpaces = [...toReject, ...state.rejectedSpaces];
      state.pendingSpaces = state.pendingSpaces.filter((s) => !ids.includes(s.id));
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
  setSpaces,
  setPendingSpaces,
  setBlinded,
  approveSpaces,
  rejectSpaces,
  setLoading,
  setError,
} = adminSpacesSlice.actions;

export default adminSpacesSlice.reducer;
