import { configureStore } from '@reduxjs/toolkit';
import reservationCReducer from '../../features/user/reservation/store/reservationSlice';
import notificationReducer from '../../home/store/notificationSlice';
import adminReducer from '../../features/admin/store/adminReducer';

const store = configureStore({
  reducer: {
    reservation: reservationCReducer,
    notification: notificationReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;
