import api from '../../../app/api/axios';

export const sellerReviewApi = {
  getList: (page = 0) => api.get('/seller/reviews', { params: { page } }),
};
