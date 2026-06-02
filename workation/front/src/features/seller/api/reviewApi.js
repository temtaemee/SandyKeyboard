import api from '../../../app/api/axios';

export const sellerReviewApi = {
  getList: (page = 0, spaceId = null) =>
    api.get('/seller/reviews', { params: { page, ...(spaceId != null ? { spaceId } : {}) } }),
  getCount: async () => {
    const res = await api.get('/seller/reviews', { params: { page: 0 } });
    return { data: { count: res.data?.totalElements ?? 0 } };
  },
  reply: (id, reply) => api.patch(`/seller/reviews/${id}/reply`, { reply }),
};
