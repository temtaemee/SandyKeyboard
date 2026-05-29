import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { spaceApi } from '../api/spaceApi';

/* ── Async Thunks ── */

export const fetchMySpaces = createAsyncThunk(
  'space/fetchMySpaces',
  async (_, { rejectWithValue }) => {
    try {
      const res = await spaceApi.getMySpaces();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? '공간 목록 조회 실패');
    }
  }
);

export const fetchSpaceOne = createAsyncThunk(
  'space/fetchSpaceOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await spaceApi.getOne(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? '공간 상세 조회 실패');
    }
  }
);

export const createSpace = createAsyncThunk(
  'space/createSpace',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await spaceApi.create(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? '공간 등록 실패');
    }
  }
);

export const updateSpace = createAsyncThunk(
  'space/updateSpace',
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      await spaceApi.update(id, dto);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? '공간 수정 실패');
    }
  }
);

export const deleteSpace = createAsyncThunk(
  'space/deleteSpace',
  async (id, { rejectWithValue }) => {
    try {
      await spaceApi.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? '공간 삭제 실패');
    }
  }
);

export const toggleSpaceVisible = createAsyncThunk(
  'space/toggleSpaceVisible',
  async ({ id, visibleYn }, { rejectWithValue }) => {
    try {
      await spaceApi.toggleVisible(id, visibleYn);
      return { id, visibleYn };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? '노출 상태 변경 실패');
    }
  }
);

/* ── Slice ── */

const spaceSlice = createSlice({
  name: 'space',
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
    // 낙관적 업데이트: visible 토글 즉시 반영
    optimisticToggle(state, action) {
      const { id, visibleYn } = action.payload;
      const item = state.list.find((s) => s.id === id);
      if (item) item.visibleYn = visibleYn;
      if (state.current?.id === id) state.current.visibleYn = visibleYn;
    },
  },
  extraReducers: (builder) => {
    // fetchMySpaces
    builder
      .addCase(fetchMySpaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMySpaces.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMySpaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchSpaceOne
    builder
      .addCase(fetchSpaceOne.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpaceOne.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchSpaceOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // createSpace
    builder
      .addCase(createSpace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSpace.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createSpace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // updateSpace
    builder
      .addCase(updateSpace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSpace.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateSpace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // deleteSpace — 낙관적 업데이트 (목록에서 즉시 제거)
    builder
      .addCase(deleteSpace.pending, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.meta.arg);
      })
      .addCase(deleteSpace.rejected, (state, action) => {
        state.error = action.payload;
      });

    // toggleSpaceVisible
    builder
      .addCase(toggleSpaceVisible.fulfilled, (state, action) => {
        const { id, visibleYn } = action.payload;
        const item = state.list.find((s) => s.id === id);
        if (item) item.visibleYn = visibleYn;
        if (state.current?.id === id) state.current.visibleYn = visibleYn;
      })
      .addCase(toggleSpaceVisible.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearCurrent, clearError, optimisticToggle } = spaceSlice.actions;
export default spaceSlice.reducer;
