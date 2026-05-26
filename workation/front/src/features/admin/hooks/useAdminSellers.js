import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  searchSellers,
  searchMembers,
  banMember,
  unbanMember,
} from '../api/adminSellersApi';
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
  addCoupon,
  deleteCoupon,
  setLoading,
} from '../store/adminSellersSlice';

// 백엔드 MemberListRespDto 필드를 프론트엔드 테이블이 기대하는 필드명으로 변환하는 매핑 함수
const mapBackendCustomerToFrontend = (item) => ({
  id: String(item.memberId || ''),
  name: item.name || item.username || '알 수 없음',
  email: item.email || '',
  phone: '010-XXXX-XXXX', // 백엔드 목록 DTO에는 전화번호가 누락되어 있어 임시 포맷팅 처리
  joinDate: item.createdAt
    ? item.createdAt.split('T')[0].replace(/-/g, '.')
    : '',
  resvCount: 0, // 백엔드 목록 DTO에는 예약 횟수가 누락되어 있어 기본값 처리
  status: item.banYn === 'Y' ? 'stopped' : 'active',
});

const mapBackendSellerToFrontend = (item) => ({
  id: String(item.memberId || ''),
  name: item.name || '알 수 없는 상호명', // 상호명
  sellerName: item.username || '판매자',
  businessNo: '000-00-00000', // 백엔드 목록 DTO에는 사업자번호가 누락되어 있어 임시 포맷팅 처리
  phone: '010-XXXX-XXXX', // 백엔드 목록 DTO에는 연락처가 누락되어 있어 임시 포맷팅 처리
  joinedAt: item.createdAt
    ? item.createdAt.split('T')[0].replace(/-/g, '.')
    : '',
  transactions: 0, // 백엔드 목록 DTO에는 거래 건수가 누락되어 있어 기본값 처리
  status: item.banYn === 'Y' ? 'stopped' : 'active',
});

export default function useAdminSellers() {
  const dispatch = useDispatch();
  const {
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
  } = useSelector((state) => state.admin.sellers);

  const fetchCustomers = useCallback(
    async (params) => {
      dispatch(setLoading(true));
      try {
        const data = await searchMembers(params);
        const mappedContent = (data.content || []).map(
          mapBackendCustomerToFrontend
        );
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
    addCoupon: (customerId, coupon) =>
      dispatch(addCoupon({ customerId, coupon })),
    deleteCoupon: (customerId, couponId) =>
      dispatch(deleteCoupon({ customerId, couponId })),
  };
}
