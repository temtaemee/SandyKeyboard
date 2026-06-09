import { createSlice } from '@reduxjs/toolkit';

const adminBoardSlice = createSlice({
  name: 'adminBoard',
  initialState: {
    posts: {
      공지사항: [],
      FAQ: [],
      리뷰: [],
      이벤트: [],
      쿠폰: [],
    },
    pinnedIds: [],
    loading: false,
    error: null,
  },
  reducers: {
    updatePostsForTab(state, action) {
      const { tab, posts } = action.payload;
      state.posts[tab] = posts;
    },
    updatePostInTab(state, action) {
      const { tab, postId, changes } = action.payload;
      state.posts[tab] = state.posts[tab].map((p) =>
        p.id === postId ? { ...p, ...changes } : p
      );
    },
    deletePostFromTab(state, action) {
      const { tab, postId } = action.payload;
      if (tab === '쿠폰') {
        // 쿠폰은 Soft Delete이므로 목록에서 제거하지 않고 delYn = 'Y' 상태로 변경하여 삭제 카테고리에만 노출시킵니다.
        state.posts[tab] = (state.posts[tab] || []).map((p) =>
          p.id === postId ? { ...p, delYn: 'Y' } : p
        );
      } else {
        state.posts[tab] = (state.posts[tab] || []).filter((p) => p.id !== postId);
        state.pinnedIds = state.pinnedIds.filter((id) => id !== postId);
      }
    },
    togglePin(state, action) {
      const id = action.payload;
      const idx = state.pinnedIds.indexOf(id);
      if (idx === -1) {
        state.pinnedIds.push(id);
      } else {
        state.pinnedIds.splice(idx, 1);
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
  updatePostsForTab,
  updatePostInTab,
  deletePostFromTab,
  togglePin,
  setLoading,
  setError,
} = adminBoardSlice.actions;

export default adminBoardSlice.reducer;
