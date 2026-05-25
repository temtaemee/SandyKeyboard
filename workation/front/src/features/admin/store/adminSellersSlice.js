import { createSlice } from '@reduxjs/toolkit';
import { SELLERS_LIST, CUSTOMER_LIST, CUSTOMER_COUPONS } from '../data/adminSellersData';

const buildSuspendedMap = (list) =>
  list.reduce((acc, item) => {
    if (item.status === 'stopped') acc[item.id] = true;
    return acc;
  }, {});

const adminSellersSlice = createSlice({
  name: 'adminSellers',
  initialState: {
    sellers: SELLERS_LIST,
    customers: CUSTOMER_LIST,
    customerCoupons: CUSTOMER_COUPONS,
    sellerSuspended: buildSuspendedMap(SELLERS_LIST),
    customerSuspended: buildSuspendedMap(CUSTOMER_LIST),
    loading: false,
    error: null,
  },
  reducers: {
    setSellers(state, action) {
      state.sellers = action.payload;
    },
    setCustomers(state, action) {
      state.customers = action.payload;
    },
    setSellerSuspended(state, action) {
      const { id, suspended } = action.payload;
      state.sellerSuspended[id] = suspended;
    },
    setCustomerSuspended(state, action) {
      const { id, suspended } = action.payload;
      state.customerSuspended[id] = suspended;
    },
    addCoupon(state, action) {
      const { customerId, coupon } = action.payload;
      if (!state.customerCoupons[customerId]) state.customerCoupons[customerId] = [];
      state.customerCoupons[customerId].unshift(coupon);
    },
    deleteCoupon(state, action) {
      const { customerId, couponId } = action.payload;
      if (state.customerCoupons[customerId]) {
        state.customerCoupons[customerId] = state.customerCoupons[customerId].filter(
          (c) => c.id !== couponId
        );
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
  setSellers,
  setCustomers,
  setSellerSuspended,
  setCustomerSuspended,
  addCoupon,
  deleteCoupon,
  setLoading,
  setError,
} = adminSellersSlice.actions;

export default adminSellersSlice.reducer;
