import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminSellers, getAdminUsers } from '../api/adminSellersApi';
import {
  setSellers,
  setCustomers,
  setSellerSuspended,
  setCustomerSuspended,
  addCoupon,
  deleteCoupon,
  setLoading,
} from '../store/adminSellersSlice';

export default function useAdminSellers() {
  const dispatch = useDispatch();
  const { sellers, customers, customerCoupons, sellerSuspended, customerSuspended, loading, error } =
    useSelector((state) => state.admin.sellers);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const [sellerResp, userResp] = await Promise.all([
          getAdminSellers(),
          getAdminUsers(),
        ]);
        dispatch(setSellers(sellerResp.data));
        dispatch(setCustomers(userResp.data));
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchData();
  }, [dispatch]);

  return {
    sellers,
    customers,
    customerCoupons,
    sellerSuspended,
    customerSuspended,
    loading,
    error,
    suspendSeller: (id, suspended) => dispatch(setSellerSuspended({ id, suspended })),
    suspendCustomer: (id, suspended) => dispatch(setCustomerSuspended({ id, suspended })),
    addCoupon: (customerId, coupon) => dispatch(addCoupon({ customerId, coupon })),
    deleteCoupon: (customerId, couponId) => dispatch(deleteCoupon({ customerId, couponId })),
  };
}
