import { configureStore } from '@reduxjs/toolkit';
import reservationCReducer from '../../features/user/reservation/store/reservationSlice';
import notificationReducer from '../../home/store/notificationSlice';
import adminReducer from '../../features/admin/store/adminReducer';
import refundReducer from '../../features/refund/store/refundSlice';
import spaceReducer from '../../features/seller/store/spaceSlice';
import stayReducer from '../../features/seller/store/staySlice';

// reducer 객체에 추가:

const store = configureStore({
  reducer: {
    reservation: reservationCReducer,
    notification: notificationReducer,
    admin: adminReducer,
    refund: refundReducer,
    space: spaceReducer,
    stay: stayReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;
