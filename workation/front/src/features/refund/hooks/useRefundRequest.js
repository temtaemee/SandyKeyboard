import { useState } from 'react';
import { refundApi } from '../api/refundApi';
import { useNavigate } from 'react-router-dom';

export default function useRefundRequest() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 💡 백엔드 RefundReason Enum과 정확히 매칭 완료!
  const REFUND_REASONS = [
    { value: 'SIMPLE_CHANGE', label: '단순변심' },
    { value: 'SCHEDULE_CHANGE', label: '일정변경' },
    { value: 'PRODUCT_CHANGE', label: '상품변경' },
    { value: 'METHOD_CHANGE', label: '결제수단변경' },
  ];

  const handleRefund = async (reservationId, reasonValue) => {
    if (!reasonValue) {
      alert('환불 사유를 선택해 주세요.');
      return;
    }

    if (
      !window.confirm(
        '정말 환불 처리를 진행하시겠습니까? 즉시 결제가 취소됩니다.'
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      // 백엔드 컨트롤러 (@RequestBody RefundRequestDto) 규격으로 데이터 전송
      const message = await refundApi.requestRefund(reservationId, reasonValue);
      alert(message);
      navigate('/resv/refund/list'); // 환불 완료 후 목록으로 이동
    } catch (error) {
      alert(error.response?.data || '환불 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { handleRefund, REFUND_REASONS, loading };
}
