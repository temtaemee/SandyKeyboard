import api from '../../../app/api/axios';

export const refundApi = {
  // 1. [유저] 환불 신청 실행
  requestRefund: async (reservationId, reason) => {
    const response = await api.post('/user/refund', { reservationId, reason });
    return response.data;
  },

  // 2. [유저] 내 환불 목록 조회
  getMyRefundList: async () => {
    const response = await api.get('/user/refund/list');
    return response.data;
  },

  // 3. [유저] 내 환불 상세 조회
  getUserRefundDetail: async (id) => {
    const response = await api.get(`/user/refund/${id}`);
    return response.data;
  },

  // 4. [판매자] 보유 숙소 환불 목록 조회 (페이징)
  getSellerRefundList: async (pno = 0) => {
    const response = await api.get(`/seller/refund/list?pno=${pno}`);
    return response.data;
  },

  // 5. [판매자] 환불 상세 조회
  getSellerRefundDetail: async (id) => {
    const response = await api.get(`/seller/refund/${id}`);
    return response.data;
  },

  // 6. [관리자] 전체 환불 목록 조회 (페이징)
  getAdminRefundList: async (pno = 0) => {
    const response = await api.get(`/admin/refund/list?pno=${pno}`);
    return response.data;
  },

  // 7. [관리자] 환불 상세 조회
  getAdminRefundDetail: async (id) => {
    const response = await api.get(`/admin/refund/${id}`);
    return response.data;
  },
};
