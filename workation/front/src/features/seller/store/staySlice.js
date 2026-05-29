import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stayApi } from '../api/stayApi';

/* ── Async Thunks ── */

export const fetchStayList = createAsyncThunk(
  'stay/fetchStayList',
  async (params, { rejectWithValue }) => {
    try {
      const res = await stayApi.getList(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? '스테이 목록 조회 실패');
    }
  }
);

export const fetchStayOne = createAsyncThunk(
  'stay/fetchStayOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await stayApi.getOne(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? '스테이 상세 조회 실패');
    }
  }
);

export const createStay = createAsyncThunk(
  'stay/createStay',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await stayApi.create(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? '스테이 등록 실패');
    }
  }
);

export const updateStay = createAsyncThunk(
  'stay/updateStay',
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      await stayApi.update(id, dto);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? '스테이 수정 실패');
    }
  }
);

export const deleteStay = createAsyncThunk(
  'stay/deleteStay',
  async (id, { rejectWithValue }) => {
    try {
      await stayApi.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? '스테이 삭제 실패');
    }
  }
);

export const toggleStayVisible = createAsyncThunk(
  'stay/toggleStayVisible',
  async ({ id, visibleYn }, { rejectWithValue }) => {
    try {
      await stayApi.toggleVisible(id, visibleYn);
      return { id, visibleYn };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? '노출 상태 변경 실패');
    }
  }
);

/* ── Slice ── */

const staySlice = createSlice({
  name: 'stay',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent(state) {
      state.current = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchStayList
    builder
      .addCase(fetchStayList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStayList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchStayList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchStayOne
    builder
      .addCase(fetchStayOne.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStayOne.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchStayOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // createStay
    builder
      .addCase(createStay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStay.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createStay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // updateStay
    builder
      .addCase(updateStay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStay.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateStay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // deleteStay — 낙관적 업데이트
    builder
      .addCase(deleteStay.pending, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.meta.arg);
      })
      .addCase(deleteStay.rejected, (state, action) => {
        state.error = action.payload;
      });

    // toggleStayVisible
    builder
      .addCase(toggleStayVisible.fulfilled, (state, action) => {
        const { id, visibleYn } = action.payload;
        const item = state.list.find((s) => s.id === id);
        if (item) item.visibleYn = visibleYn;
        if (state.current?.id === id) state.current.visibleYn = visibleYn;
      })
      .addCase(toggleStayVisible.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCurrent, clearError } = staySlice.actions;
export default staySlice.reducer;
