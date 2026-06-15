import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../../../app/api/axios';

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isCalled = useRef(false);

  useEffect(() => {
    if (isCalled.current) return;

    isCalled.current = true;
    confirmPayment();
  }, []);

  async function confirmPayment() {
    try {
      const paymentKey = searchParams.get('paymentKey');
      const orderId = searchParams.get('orderId');
      const amount = searchParams.get('amount');
      const reservationId = searchParams.get('reservationId');

      console.log('Toss Params:', {
        paymentKey,
        orderId,
        amount,
        reservationId,
      });

      if (!reservationId) {
        throw new Error('reservationId 누락');
      }

      if (!paymentKey || !orderId || !amount) {
        throw new Error('결제 필수 정보(paymentKey, orderId, amount) 누락');
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다. 다시 로그인한 뒤 예약 내역에서 결제 상태를 확인해 주세요.');
        navigate('/login');
        return;
      }

      const resp = await api.post('/user/payment/confirm', {
        paymentKey,
        orderId,
        amount: Number(amount),
        reservationId,
      });

      console.log('결제 승인 응답 성공:', resp.data);

      alert('결제 승인 완료');
      navigate('/');
    } catch (err) {
      console.error('결제 승인 실패 최종 에러:', err);
      const serverMessage = err.response?.data?.message;
      const providerBody = err.response?.data?.providerBody;
      const detail = providerBody ? `${serverMessage}\n${providerBody}` : serverMessage;

      alert(`결제 처리 중 오류가 발생했습니다: ${detail || err.message || err}`);
      navigate('/payment/fail');
    }
  }

  return (
    <Wrapper>
      <Card>
        <Title>결제 승인 중입니다...</Title>
        <Description>잠시만 기다려주세요.</Description>
      </Card>
    </Wrapper>
  );
}

export default PaymentSuccessPage;

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
`;

const Card = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 48px;
  border-radius: 24px;
  background: white;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #222;
`;

const Description = styled.p`
  margin-top: 16px;
  font-size: 16px;
  color: #666;
`;
