import { configureStore } from '@reduxjs/toolkit';
import reservationCReducer from '../../features/user/reservation/store/reservationSlice';
import notificationReducer from '../../home/store/notificationSlice';
import adminReducer from '../../features/admin/store/adminReducer';
import refundReducer from '../../features/refund/store/refundSlice';
import spaceReducer from '../../features/seller/store/spaceSlice';
import stayReducer from '../../features/seller/store/staySlice';
import destinationReducer from '../../features/user/destination/store/destinationSlice';

const store = configureStore({
  reducer: {
    reservation: reservationCReducer,
    notification: notificationReducer,
    admin: adminReducer,
    refund: refundReducer,
    space: spaceReducer,
    stay: stayReducer,
    destination: destinationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
