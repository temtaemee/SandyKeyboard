import { configureStore } from '@reduxjs/toolkit';
import reservationCReducer from '../../features/user/reservation/store/reservationSlice';
import notificationReducer from '../../home/store/notificationSlice'

const store = configureStore({
  reducer: {
    reservation: reservationCReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export default store;
