import { createSlice } from '@reduxjs/toolkit';
const adminSellersSlice = createSlice({
  name: 'adminSellers',
  initialState: {
    sellers: [],
    customers: [],
    sellersTotalPage: 1,
    sellersTotalCount: 0,
    sellersUnfilteredTotal: 0,
    sellersActiveCount: 0,
    sellersBannedCount: 0,
    sellersNewCount: 0,
    customersTotalPage: 1,
    customersTotalCount: 0,
    customersUnfilteredTotal: 0,
    customersActiveCount: 0,
    customersBannedCount: 0,
    customersNewCount: 0,
    customerCoupons: {},
    sellerSuspended: {},
    customerSuspended: {},
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
    setSellersMetadata(state, action) {
      const { totalPage, totalCount } = action.payload;
      state.sellersTotalPage = totalPage;
      state.sellersTotalCount = totalCount;
    },
    setCustomersMetadata(state, action) {
      const { totalPage, totalCount } = action.payload;
      state.customersTotalPage = totalPage;
      state.customersTotalCount = totalCount;
    },
    setSellersStatusCounts(state, action) {
      state.sellersUnfilteredTotal = action.payload.total;
      state.sellersActiveCount = action.payload.active;
      state.sellersBannedCount = action.payload.banned;
    },
    setCustomersStatusCounts(state, action) {
      state.customersUnfilteredTotal = action.payload.total;
      state.customersActiveCount = action.payload.active;
      state.customersBannedCount = action.payload.banned;
    },
    adjustSellersStatusCounts(state, action) {
      const { activeDelta, bannedDelta } = action.payload;
      state.sellersActiveCount = Math.max(0, state.sellersActiveCount + activeDelta);
      state.sellersBannedCount = Math.max(0, state.sellersBannedCount + bannedDelta);
    },
    adjustCustomersStatusCounts(state, action) {
      const { activeDelta, bannedDelta } = action.payload;
      state.customersActiveCount = Math.max(0, state.customersActiveCount + activeDelta);
      state.customersBannedCount = Math.max(0, state.customersBannedCount + bannedDelta);
    },
    setSellersNewCount(state, action) {
      state.sellersNewCount = action.payload;
    },
    setCustomersNewCount(state, action) {
      state.customersNewCount = action.payload;
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
  setSellersMetadata,
  setCustomersMetadata,
  setSellersStatusCounts,
  setCustomersStatusCounts,
  adjustSellersStatusCounts,
  adjustCustomersStatusCounts,
  setSellersNewCount,
  setCustomersNewCount,
  setSellerSuspended,
  setCustomerSuspended,
  addCoupon,
  deleteCoupon,
  setLoading,
  setError,
} = adminSellersSlice.actions;

export default adminSellersSlice.reducer;