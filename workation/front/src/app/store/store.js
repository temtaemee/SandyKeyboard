import { configureStore } from '@reduxjs/toolkit';
import reservationCReducer from '../../features/user/reservation/store/reservationSlice';
import notificationReducer from '../../home/store/notificationSlice';
import adminReducer from '../../features/admin/store/adminReducer';
import refundReducer from '../../features/refund/store/refundSlice';

const store = configureStore({
  reducer: {
    reservation: reservationCReducer,
    notification: notificationReducer,
    admin: adminReducer,
    refund: refundReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;
