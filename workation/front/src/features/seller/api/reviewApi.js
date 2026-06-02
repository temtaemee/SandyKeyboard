import api from '../../../app/api/axios';

export const sellerReviewApi = {
  getList:  (pno = 0) => api.get('/seller/review/list',  { params: { pno } }),
  getCount: ()        => api.get('/seller/review/count'),
};
