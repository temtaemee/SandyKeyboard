import api from '../../../app/api/axios';

export const settlementApi = {
  getPayoutList:    (pno = 0)    => api.get('/seller/payout/list',   { params: { pno } }),
  getInvoiceList:   (pno = 0)    => api.get('/seller/invoice/list',  { params: { pno } }),
  getInvoiceDetail: (invoiceId)  => api.get(`/auth/invoice/${invoiceId}`),
};
