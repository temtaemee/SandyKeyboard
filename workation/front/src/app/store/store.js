import { configureStore } from '@reduxjs/toolkit';
import reservationCReducer from '../../features/user/reservation/store/reservationSlice';

const store = configureStore({
  reducer: {
    reservation: reservationCReducer,
  },
});
export default store;
