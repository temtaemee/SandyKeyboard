import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    user: userReducer, // 사용자 관련 리듀서 // 경로 추가 필요
    // 다른 리듀서 추가 가능
  },
});
export default store;
