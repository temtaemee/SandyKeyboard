import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { refundApi } from '../api/refundApi';

// 예시: 내 환불 목록 비동기 Fetch
export const fetchMyRefunds = createAsyncThunk(
  'refund/fetchMyRefunds',
  async (_, { rejectWithValue }) => {
    try {
      return await refundApi.getMyRefunds();
    } catch (error) {
      return rejectWithValue(error.response?.data || '목록 로드 실패');
    }
  }
);

const refundSlice = createSlice({
  name: 'refund',
  initialState: {
    myRefunds: [],
    currentDetail: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDetail: (state) => {
      state.currentDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyRefunds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyRefunds.fulfilled, (state) => {
        state.loading = false;
        state.myRefunds = action.payload;
      })
      .addCase(fetchMyRefunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDetail } = refundSlice.actions;
export default refundSlice.reducer;
