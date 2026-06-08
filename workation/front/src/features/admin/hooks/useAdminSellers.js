import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  searchSellers,
  searchMembers,
  banMember,
  unbanMember,
} from '../api/adminSellersApi';
import {
  getMemberCouponList,
  adminRegister,
  deleteMemberCoupon,
  getCouponList,
} from '../api/adminBoardApi';
import { isNewMember } from '../data/adminSellersConstants';
import {
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
  addCoupon as addCouponAction,
  deleteCoupon as deleteCouponAction,
  setCustomerCoupons,
  setIssuableCoupons,
  setLoading,
} from '../store/adminSellersSlice';

// 백엔드 MemberListRespDto 필드를 프론트엔드 테이블이 기대하는 필드명으로 변환하는 매핑 함수
const mapBackendCustomerToFrontend = (item) => ({
  id: String(item.memberId || ''),
  username: item.username || '',
  name: item.name || item.username || '알 수 없음',
  email: item.email || '',
  phone: item.phone || '등록 없음', // 👈 백엔드 실제 연락처(phone) 매핑
  joinDate: item.createdAt
    ? item.createdAt.split('T')[0].replace(/-/g, '.')
    : '',
  resvCount: Number(item.resvCount || 0), // 👈 백엔드 실제 예약 횟수(resvCount) 매핑
  status: item.banYn === 'Y' ? 'stopped' : 'active',
});

const mapBackendSellerToFrontend = (item) => ({
  id: String(item.memberId || ''),
  name: item.name || '알 수 없는 상호명', // 상호명
  sellerName: item.username || '판매자',
  businessNo: item.businessNo || '등록 없음', // 👈 백엔드 실제 사업자번호(businessNo) 매핑
  phone: item.phone || '등록 없음', // 👈 백엔드 실제 연락처(phone) 매핑
  joinedAt: item.createdAt
    ? item.createdAt.split('T')[0].replace(/-/g, '.')
    : '',
  transactions: Number(item.transactions || 0), // 👈 백엔드 실제 거래 건수(transactions) 매핑
  status: item.banYn === 'Y' ? 'stopped' : 'active',
});

// 백엔드 MemberCouponRespDto 필드를 프론트엔드 UI가 기대하는 필드명으로 변환하는 매핑 함수
const mapBackendCouponToFrontend = (item) => {
  const fmt = (dateTimeStr) => {
    if (!dateTimeStr) return '—';
    return dateTimeStr.split('T')[0].replace(/-/g, '.');
  };
  return {
    id: item.id,
    couponId: item.couponId,
    title: item.couponName || '쿠폰',
    discount: item.discountRate ? `${item.discountRate}%` : '0%',
    issuedAt: fmt(item.createdAt),
    expireAt: fmt(item.expiredDate),
  };
};

export default function useAdminSellers() {
  const dispatch = useDispatch();
  const {
    sellers,
    customers,
    issuableCoupons,
    sellersTotalPage,
    sellersTotalCount,
    sellersUnfilteredTotal,
    sellersActiveCount,
    sellersBannedCount,
    sellersNewCount,
    customersTotalPage,
    customersTotalCount,
    customersUnfilteredTotal,
    customersActiveCount,
    customersBannedCount,
    customersNewCount,
    customerCoupons,
    sellerSuspended,
    customerSuspended,
    loading,
    error,
  } = useSelector((state) => state.admin.sellers);

  const fetchCustomers = useCallback(
    async (params) => {
      dispatch(setLoading(true));
      try {
        const data = await searchMembers(params);
        const mappedContent = (data.content || [])
          .map(mapBackendCustomerToFrontend)
          .filter((item) => item.id !== '1');
        dispatch(setCustomers(mappedContent));
        dispatch(
          setCustomersMetadata({
            totalPage: data.totalPage || 1,
            totalCount: data.totalCount || 0,
          })
        );
        if (!params?.status) {
          const newCount = mappedContent.filter((item) =>
            isNewMember(item.joinDate)
          ).length;
          dispatch(setCustomersNewCount(newCount));
        }
      } catch (err) {
        console.error('고객 목록 fetch 에러:', err);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const fetchSellers = useCallback(
    async (params) => {
      dispatch(setLoading(true));
      try {
        const data = await searchSellers(params);
        const mappedContent = (data.content || []).map(
          mapBackendSellerToFrontend
        );
        dispatch(setSellers(mappedContent));
        dispatch(
          setSellersMetadata({
            totalPage: data.totalPage || 1,
            totalCount: data.totalCount || 0,
          })
        );
        if (!params?.status) {
          const newCount = mappedContent.filter((item) =>
            isNewMember(item.joinedAt)
          ).length;
          dispatch(setSellersNewCount(newCount));
        }
      } catch (err) {
        console.error('판매자 목록 fetch 에러:', err);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const fetchSellersStats = useCallback(async () => {
    try {
      const [allData, activeData, bannedData] = await Promise.all([
        searchSellers({ page: 1, size: 1 }),
        searchSellers({ page: 1, size: 1, status: 'ACTIVE' }),
        searchSellers({ page: 1, size: 1, status: 'BANNED' }),
      ]);
      dispatch(
        setSellersStatusCounts({
          total: allData.totalCount || 0,
          active: activeData.totalCount || 0,
          banned: bannedData.totalCount || 0,
        })
      );
    } catch (err) {
      console.error('판매자 통계 fetch 에러:', err);
    }
  }, [dispatch]);

  const fetchCustomersStats = useCallback(async () => {
    try {
      const [allData, activeData, bannedData] = await Promise.all([
        searchMembers({ page: 1, size: 1 }),
        searchMembers({ page: 1, size: 1, status: 'ACTIVE' }),
        searchMembers({ page: 1, size: 1, status: 'BANNED' }),
      ]);
      dispatch(
        setCustomersStatusCounts({
          total: allData.totalCount || 0,
          active: activeData.totalCount || 0,
          banned: bannedData.totalCount || 0,
        })
      );
    } catch (err) {
      console.error('고객 통계 fetch 에러:', err);
    }
  }, [dispatch]);

  const suspendSeller = useCallback(
    async (id, suspended) => {
      try {
        if (suspended) {
          await banMember(id);
          dispatch(
            adjustSellersStatusCounts({ activeDelta: -1, bannedDelta: 1 })
          );
        } else {
          await unbanMember(id);
          dispatch(
            adjustSellersStatusCounts({ activeDelta: 1, bannedDelta: -1 })
          );
        }
        dispatch(setSellerSuspended({ id, suspended }));
      } catch (err) {
        console.error('판매자 정지/해제 에러:', err);
      }
    },
    [dispatch]
  );

  const suspendCustomer = useCallback(
    async (id, suspended) => {
      try {
        if (suspended) {
          await banMember(id);
          dispatch(
            adjustCustomersStatusCounts({ activeDelta: -1, bannedDelta: 1 })
          );
        } else {
          await unbanMember(id);
          dispatch(
            adjustCustomersStatusCounts({ activeDelta: 1, bannedDelta: -1 })
          );
        }
        dispatch(setCustomerSuspended({ id, suspended }));
      } catch (err) {
        console.error('고객 정지/해제 에러:', err);
      }
    },
    [dispatch]
  );

  const fetchMemberCoupons = useCallback(
    async (customerId, username) => {
      dispatch(setLoading(true));
      try {
        const resp = await getMemberCouponList(0, username);
        const list = Array.isArray(resp.data) ? resp.data : (resp.data.content || []);
        const mappedList = list.map(mapBackendCouponToFrontend);
        dispatch(setCustomerCoupons({ customerId, coupons: mappedList }));
      } catch (err) {
        console.error('회원 쿠폰 목록 fetch 에러:', err);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  const fetchIssuableCoupons = useCallback(async () => {
    try {
      const resp = await getCouponList();
      const list = Array.isArray(resp.data) ? resp.data : (resp.data.content || []);
      dispatch(setIssuableCoupons(list));
      return list;
    } catch (err) {
      console.error('발급 가능 쿠폰 목록 fetch 에러:', err);
      return [];
    }
  }, [dispatch]);

  const addCoupon = useCallback(
    async (customerId, username, couponId) => {
      dispatch(setLoading(true));
      try {
        const payload = {
          username: username,
          couponId: Number(couponId) || couponId,
        };
        await adminRegister(payload);
        await fetchMemberCoupons(customerId, username);
      } catch (err) {
        console.error('쿠폰 발급 에러:', err);
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, fetchMemberCoupons]
  );

  const deleteCoupon = useCallback(
    async (customerId, username, couponId) => {
      dispatch(setLoading(true));
      try {
        await deleteMemberCoupon({ data: { username, couponId: Number(couponId) || couponId } });
        await fetchMemberCoupons(customerId, username);
      } catch (err) {
        console.error('쿠폰 삭제 에러:', err);
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, fetchMemberCoupons]
  );

  return {
    sellers,
    customers,
    sellersTotalPage,
    sellersTotalCount,
    sellersUnfilteredTotal,
    sellersActiveCount,
    sellersBannedCount,
    sellersNewCount,
    customersTotalPage,
    customersTotalCount,
    customersUnfilteredTotal,
    customersActiveCount,
    customersBannedCount,
    customersNewCount,
    customerCoupons,
    sellerSuspended,
    customerSuspended,
    loading,
    error,
    fetchCustomers,
    fetchSellers,
    fetchSellersStats,
    fetchCustomersStats,
    suspendSeller,
    suspendCustomer,
    addCoupon,
    deleteCoupon,
    fetchMemberCoupons,
    fetchIssuableCoupons,
    issuableCoupons,
  };
}
