import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminPartnerCompanies,
  createPartnerCompany,
  updatePartnerCompany,
  togglePartnerCompanyStatus,
} from '../api/adminReservationApi';
import {
  setPartners,
  setLoading,
  setError,
} from '../store/adminReservationSlice';

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
    partnerSince: item.createdAt ? item.createdAt.split('T')[0].replace(/-/g, '.') : '',
    updatedAt: item.updatedAt ? item.updatedAt.split('T')[0].replace(/-/g, '.') : (item.createdAt ? item.createdAt.split('T')[0].replace(/-/g, '.') : ''),
    created_at: item.createdAt || '',
  };
};

export default function useAdminReservation() {
  const dispatch = useDispatch();
  const { partners, loading, error } = useSelector((state) => state.admin.reservation);

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

  const handleAddPartner = useCallback(async (partner) => {
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
  }, [dispatch, fetchPartners]);

  const handleUpdatePartner = useCallback(async (id, changes) => {
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
  }, [dispatch, fetchPartners]);

  const handleTogglePartnerStatus = useCallback(async (id) => {
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
  }, [dispatch, fetchPartners]);

  return {
    partners,
    loading,
    error,
    fetchPartners,
    addPartner: handleAddPartner,
    updatePartner: handleUpdatePartner,
    togglePartnerStatus: handleTogglePartnerStatus,
  };
}
