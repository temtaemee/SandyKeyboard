import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminReservations,
  getAdminPartnerCompanies,
  createPartnerCompany,
  updatePartnerCompany,
  togglePartnerCompanyStatus,
  getAdminDashboardSummary,
} from '../api/adminReservationApi';
import {
  setReservations,
  setReservationsMetadata,
  setAllReservations,
  setPartners,
  setLoading,
  setError,
  setDashboardSummary,
} from '../store/adminReservationSlice';

// ─── 아바타 컬러 팔레트 ───
const AVATAR_COLORS = [
  '#a5cdd6',
  '#c3edf6',
  '#d4b8e0',
  '#f9c6c6',
  '#b8d8c6',
  '#fbd38d',
];

// 백엔드 ReservationAdminListResDto → 프론트 테이블 필드명으로 변환하는 매핑 함수
const mapBackendReservationToFrontend = (item, index) => ({
  id: String(item.id ?? ''),
  orderId: item.orderId ?? '',
  // 대표 예약자명 우선, 없으면 계정 아이디로 fallback
  customerName: item.primaryGuestName ?? item.username ?? '알 수 없음',
  customerInitial: (item.primaryGuestName ?? item.username ?? 'U')[0],
  customerEmail: item.primaryGuestEmail ?? '',
  customerPhone: item.primaryGuestPhone ?? '',
  username: item.username ?? '',
  guestCount: item.guestCount ?? 0,
  spaceName: item.spaceName ?? '정보 없음',
  stayName: item.stayName ?? '정보 없음',
  date: `${item.checkinDate ?? ''} ~ ${item.checkoutDate ?? ''}`,
  createdAt: item.createdAt ?? null,
  amount:
    item.totalPrice != null
      ? `₩${Number(item.totalPrice).toLocaleString()}`
      : '—',
  rawTotalPrice: item.totalPrice ?? 0,
  // status는 Enum name (RESERVATION_STATUS_MAP 키와 일치)
  status: item.status ?? 'PAYMENT_COMPLETED',
  // statusLabel은 서버에서 한글로 내려오므로 직접 사용 가능
  statusLabel: item.statusLabel ?? '',
  avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
});

// 백엔드 CompanyRespDto 필드를 프론트엔드 파트너 목록 규격으로 변환하는 매핑 함수
const mapBackendCompanyToFrontend = (item, index) => {
  const iconBgs = ['#e0f2fe', '#f0fdf4', '#fef3c7', '#fce7f3', '#e2e8f0'];
  const iconColors = ['#0369a1', '#15803d', '#b45309', '#be185d', '#475569'];
  return {
    id: item.id,
    name: item.companyName,
    businessNumber: item.businessNo || '',
    reservationCount: 0, // 백엔드 목록 DTO에는 예약 횟수가 없어 기본값 0 처리
    status: item.delYn === 'N' ? 'active' : 'inactive',
    iconBg: iconBgs[index % iconBgs.length],
    iconColor: iconColors[index % iconColors.length],
    partnerSince: item.createdAt
      ? item.createdAt.split('T')[0].replace(/-/g, '.')
      : '',
    updatedAt: item.updatedAt
      ? item.updatedAt.split('T')[0].replace(/-/g, '.')
      : item.createdAt
        ? item.createdAt.split('T')[0].replace(/-/g, '.')
        : '',
    created_at: item.createdAt || '',
  };
};

export default function useAdminReservation() {
  const dispatch = useDispatch();
  const {
    partners,
    reservations,
    reservationsTotalPage,
    reservationsTotalCount,
    allReservations,
    loading,
    error,
    dashboardSummary,
  } = useSelector((state) => state.admin.reservation);

  // ─── 이번 달 예약 건수 계산, 취소금액 ───
  const fetchDashboardSummary = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const resp = await getAdminDashboardSummary();
      dispatch(setDashboardSummary(resp.data));
    } catch (err) {
      console.error('대시보드 요약 fetch 에러:', err);
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // ─── 환불 완료 목록 ───
  const refundedList = allReservations.filter(
    (r) => r.status === 'REFUND_COMPLETED'
  );

  // ─── 예약 목록 조회 ───
  const fetchReservations = useCallback(
    async (params = {}) => {
      dispatch(setLoading(true));
      try {
        const resp = await getAdminReservations(params);
        const data = resp.data;
        // 백엔드가 Page 객체 또는 배열로 응답하는 경우 모두 대응
        const content = Array.isArray(data) ? data : (data.content ?? []);
        const mapped = content
          .map(mapBackendReservationToFrontend)
          .filter((r) => r.status !== 'PENDING');
        dispatch(setReservations(mapped));
        dispatch(
          setReservationsMetadata({
            totalPage: data.totalPages ?? data.totalPage ?? 1,
            totalCount: data.totalElements ?? data.totalCount ?? mapped.length,
          })
        );
      } catch (err) {
        console.error('예약 목록 fetch 에러:', err);
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  // ─── 전체 예약 조회 (모든 페이지를 순차적으로 로드) ───
  const fetchAllReservations = useCallback(async () => {
    try {
      let allList = [];
      let page = 0;
      let hasNext = true;

      while (hasNext && page < 20) {
        // 최대 20페이지(200개) 안전 제한
        const resp = await getAdminReservations({ pno: page });
        const data = resp.data;
        const content = Array.isArray(data) ? data : (data.content ?? []);
        console.log(
          `[useAdminReservation] page=${page} fetched ${content.length} raw items`
        );
        if (content.length === 0) {
          hasNext = false;
        } else {
          const mapped = content
            .map(mapBackendReservationToFrontend)
            .filter((r) => r.status !== 'PENDING');
          allList = [...allList, ...mapped];

          const totalPages = data.totalPages ?? data.totalPage ?? 1;
          console.log(
            `[useAdminReservation] page=${page} content mapped. totalPages=${totalPages}`
          );
          if (page >= totalPages - 1) {
            hasNext = false;
          } else {
            page++;
          }
        }
      }
      console.log(
        `[useAdminReservation] Final allReservations loaded count: ${allList.length}`
      );
      dispatch(setAllReservations(allList));
    } catch (err) {
      console.error('전체 예약 fetch 에러:', err);
    }
  }, [dispatch]);

  // ─── 파트너사 목록 조회 ───
  const fetchPartners = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await getAdminPartnerCompanies();
      const mapped = (data.content || []).map(mapBackendCompanyToFrontend);
      dispatch(setPartners(mapped));
    } catch (err) {
      console.error('파트너사 목록 fetch 에러:', err);
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // ─── 파트너사 등록 ───
  const addPartner = useCallback(
    async (partner) => {
      dispatch(setLoading(true));
      try {
        await createPartnerCompany({
          companyName: partner.name,
          businessNo: partner.businessNumber,
        });
        await fetchPartners(); // 목록 실시간 갱신
      } catch (err) {
        console.error(err);
        alert('파트너사 등록에 실패했습니다.');
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, fetchPartners]
  );

  // ─── 파트너사 수정 ───
  const updatePartner = useCallback(
    async (id, changes) => {
      dispatch(setLoading(true));
      try {
        await updatePartnerCompany(id, {
          companyName: changes.name,
          businessNo: changes.businessNumber,
        });
        await fetchPartners(); // 목록 실시간 갱신
      } catch (err) {
        console.error(err);
        alert('파트너사 수정에 실패했습니다.');
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, fetchPartners]
  );

  // ─── 파트너사 활성/비활성 토글 ───
  const togglePartnerStatus = useCallback(
    async (id) => {
      dispatch(setLoading(true));
      try {
        await togglePartnerCompanyStatus(id);
        await fetchPartners(); // 목록 실시간 갱신
      } catch (err) {
        console.error(err);
        alert('파트너사 상태 변경에 실패했습니다.');
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, fetchPartners]
  );

  return {
    partners,
    reservations,
    reservationsTotalPage,
    reservationsTotalCount,
    allReservations,
    dashboardSummary,
    refundedList,
    loading,
    error,
    fetchReservations,
    fetchAllReservations,
    fetchDashboardSummary,
    fetchPartners,
    addPartner,
    updatePartner,
    togglePartnerStatus,
  };
}
