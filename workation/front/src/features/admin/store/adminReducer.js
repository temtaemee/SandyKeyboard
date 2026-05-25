import { combineReducers } from '@reduxjs/toolkit';
import adminSpacesReducer from './adminSpacesSlice';
import adminSellersReducer from './adminSellersSlice';
import adminBoardReducer from './adminBoardSlice';
import adminReservationReducer from './adminReservationSlice';

const adminReducer = combineReducers({
  spaces: adminSpacesReducer,
  sellers: adminSellersReducer,
  board: adminBoardReducer,
  reservation: adminReservationReducer,
});

export default adminReducer;
