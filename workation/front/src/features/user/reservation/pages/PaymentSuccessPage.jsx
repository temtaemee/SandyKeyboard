import React, { useEffect, useRef } from 'react'; // useRef 추가
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import api from '../../../../app/api/axios';

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Strict Mode 등으로 인한 중복 호출을 막기 위한 flag
  const isCalled = useRef(false);

  useEffect(() => {
    // 이미 호출된 적이 있다면 두 번째 마운트 때는 실행하지 않음
    if (isCalled.current) return;

    isCalled.current = true;
    confirmPayment();
  }, []); // 의존성 배열을 빈 배열[]로 두어 최초 마운트 시 1회만 실행하도록 변경

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

      // 백엔드로 승인 요청 전송
      console.log('백엔드로 결제 승인 요청을 보냅니다...');
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
      // 어떤 에러인지 사용자에게 알림을 주면 디버깅이 편해집니다.
      alert(`결제 처리 중 오류가 발생했습니다: ${err.message || err}`);
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

/* 기존 styled-components 스타일 유지 */
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
