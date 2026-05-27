import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import useRefundRequest from '../hooks/useRefundRequest';
import styled from 'styled-components';

export default function RefundRequestPage() {
  const { reservationId } = useParams();
  const { handleRefund, REFUND_REASONS, loading } = useRefundRequest();
  const [selectedReason, setSelectedReason] = useState('');

  return (
    <Container>
      <h2>🛡️ 취소 및 환불 신청 요청</h2>
      <p className="desc-text">
        선택하신 예약 번호 [{reservationId}]번에 대한 환불 사유를 선택해 주세요.
      </p>

      <SelectZone>
        <label>취소 사유 선택 (필수)</label>
        <select
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
        >
          <option value="">-- 사유를 선택하세요 --</option>
          {REFUND_REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </SelectZone>

      <Button
        disabled={loading || !selectedReason}
        onClick={() => handleRefund(reservationId, selectedReason)}
      >
        {loading ? '토스 결제 취소 통신 중...' : '환불 신청 완료하기'}
      </Button>
    </Container>
  );
}

// ================= Styled Components =================
const Container = styled.div`
  max-width: 600px;
  margin: 60px auto;
  padding: 40px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.card};

  h2 {
    font-size: 22px;
    color: ${({ theme }) => theme.colors.textDark};
    margin-bottom: 12px;
  }

  .desc-text {
    color: ${({ theme }) => theme.colors.textMid};
    font-size: 15px;
    margin-bottom: 30px;
  }
`;

const SelectZone = styled.div`
  margin-bottom: 35px;

  label {
    display: block;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textDark};
    margin-bottom: 10px;
    font-size: 15px;
  }

  select {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    font-family: ${({ theme }) => theme.fonts.base};
    color: ${({ theme }) => theme.colors.textDark};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.sm};
    background-color: ${({ theme }) => theme.colors.white};
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background-color: #e53e3e; /* 환불 파괴 액션은 경고의 의미로 기존 명도 높은 레드 계열 유지 */
  color: ${({ theme }) => theme.colors.white};
  font-weight: bold;
  font-size: 16px;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #c53030;
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.textLight};
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: not-allowed;
  }
`;
