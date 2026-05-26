// src/features/reservation/pages/ReservationInsertPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { loadTossPayments } from '@tosspayments/payment-sdk';

import useReservationInsert from '../hooks/useReservationInsert';
import { getAvailableCoupons } from '../api/reservationApi';

function ReservationInsertPage() {
  const clientKey = 'test_ck_5OWRapdA8djRAOLzPxRYVo1zEqZK';
  const { stayId } = useParams();

  const { insertReservation } = useReservationInsert();

  const [coupons, setCoupons] = useState([]);

  const [vo, setVo] = useState({
    couponId: '',
    guestCount: 1,
    primaryGuestName: '',
    checkinDate: '',
    checkoutDate: '',
    primaryGuestPhone: '',
    primaryGuestEmail: '',
    refundBankName: '',
    refundAccountNumber: '',
    refundAccountHolder: '',
  });

  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const resp = await getAvailableCoupons();
        setCoupons(resp.data.content || []);
      } catch (err) {
        console.error('쿠폰 목록을 불러오는 중 오류 발생:', err);
      }
    }
    fetchCoupons();
  }, []);

  function handleChange(e) {
    setVo({
      ...vo,
      [e.target.name]: e.target.value,
    });
  }

  function handleFileChange(e) {
    setFileList([...e.target.files]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // 1. 백엔드에서 생성된 객체로부터 ID와 계산된 실제 금액을 안전하게 구조 분해 할당합니다.
      const { reservationId, totalPrice } = await insertReservation(
        stayId,
        vo,
        fileList
      );

      // 💡 [수정완료] 브라우저 환경에 맞게 console.log로 정정
      console.log('백엔드 정산 금액 확인: ', totalPrice);

      // 2. 받아온 실제 정산 금액을 결제창 함수로 토스합니다.
      await requestPayment(reservationId, totalPrice);
    } catch (err) {
      console.error(err);
    }
  }

  async function requestPayment(reservationId, totalPrice) {
    const tossPayments = await loadTossPayments(clientKey);
    const currentOrigin = window.location.origin;

    await tossPayments.requestPayment('CARD', {
      amount: totalPrice, // 백엔드가 검증한 실거래 금액 주입
      orderId: `ORDER_${reservationId}_${Date.now()}`,
      orderName: '숙소 예약 결제',
      customerName: vo.primaryGuestName,
      customerEmail: vo.primaryGuestEmail,
      successUrl: `${currentOrigin}/resv/payment/success?reservationId=${reservationId}`,
      failUrl: `${currentOrigin}/payment/fail`,
    });
  }

  return (
    <Wrapper>
      <Container>
        <Title>예약 / 결제</Title>

        <StyledForm onSubmit={handleSubmit}>
          {/* 예약 정보 */}
          <Section>
            <SectionTitle>예약 정보</SectionTitle>

            <InputGroup>
              <Label>적용 가능한 쿠폰</Label>
              <Select
                name="couponId"
                value={vo.couponId}
                onChange={handleChange}
              >
                <option value="">=== 쿠폰 선택 안함 ===</option>
                {coupons.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.couponName} ({c.discountRate}% 할인)
                  </option>
                ))}
              </Select>
            </InputGroup>

            <InputGroup>
              <Label>인원 수</Label>
              <Input
                type="number"
                name="guestCount"
                placeholder="인원 수 입력"
                value={vo.guestCount}
                onChange={handleChange}
              />
            </InputGroup>

            <InputGroup>
              <Label>대표 예약자 이름</Label>
              <Input
                type="text"
                name="primaryGuestName"
                placeholder="이름 입력"
                value={vo.primaryGuestName}
                onChange={handleChange}
              />
            </InputGroup>

            <Row>
              <InputGroup>
                <Label>체크인 날짜</Label>
                <Input
                  type="date"
                  name="checkinDate"
                  value={vo.checkinDate}
                  onChange={handleChange}
                />
              </InputGroup>

              <InputGroup>
                <Label>체크아웃 날짜</Label>
                <Input
                  type="date"
                  name="checkoutDate"
                  value={vo.checkoutDate}
                  onChange={handleChange}
                />
              </InputGroup>
            </Row>

            <InputGroup>
              <Label>전화번호</Label>
              <Input
                type="text"
                name="primaryGuestPhone"
                placeholder="010-0000-0000"
                value={vo.primaryGuestPhone}
                onChange={handleChange}
              />
            </InputGroup>

            <InputGroup>
              <Label>이메일</Label>
              <Input
                type="email"
                name="primaryGuestEmail"
                placeholder="example@email.com"
                value={vo.primaryGuestEmail}
                onChange={handleChange}
              />
            </InputGroup>
          </Section>

          {/* 환불 계좌 */}
          <Section>
            <SectionTitle>지원금 수령 계좌</SectionTitle>

            <InputGroup>
              <Label>은행명</Label>
              <Input
                type="text"
                name="refundBankName"
                placeholder="은행명 입력"
                value={vo.refundBankName}
                onChange={handleChange}
              />
            </InputGroup>

            <InputGroup>
              <Label>계좌번호</Label>
              <Input
                type="text"
                name="refundAccountNumber"
                placeholder="계좌번호 입력"
                value={vo.refundAccountNumber}
                onChange={handleChange}
              />
            </InputGroup>

            <InputGroup>
              <Label>예금주명</Label>
              <Input
                type="text"
                name="refundAccountHolder"
                placeholder="예금주명 입력"
                value={vo.refundAccountHolder}
                onChange={handleChange}
              />
            </InputGroup>
          </Section>

          {/* 파일 */}
          <Section>
            <SectionTitle>첨부 파일</SectionTitle>

            <FileBox>
              <FileLabel htmlFor="file-input">파일 선택</FileLabel>

              <FileInput
                id="file-input"
                type="file"
                multiple
                onChange={handleFileChange}
              />

              <FileText>
                {fileList.length > 0
                  ? `${fileList.length}개 파일 선택됨`
                  : '선택된 파일 없음'}
              </FileText>
            </FileBox>
          </Section>

          <SubmitButton type="submit">결제하기</SubmitButton>
        </StyledForm>
      </Container>
    </Wrapper>
  );
}

export default ReservationInsertPage;

/* ========================= */
/* styled-components */
/* ========================= */

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 80px 20px;
  background: ${({ theme }) => theme.colors.bg};
`;

const Container = styled.div`
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 48px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textDark};
  margin-bottom: 40px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 32px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textDark};
`;

const Row = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const InputGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMid};
`;

const Select = styled.select`
  width: 100%;
  height: 54px;
  padding: 0 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.white};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textDark};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px rgba(44, 100, 128, 0.12);
  }
`;

const Input = styled.input`
  width: 100%;
  height: 54px;
  padding: 0 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.white};
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textDark};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px rgba(44, 100, 128, 0.12);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const FileBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FileLabel = styled.label`
  width: fit-content;
  padding: 12px 20px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.gradients.hero};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
  cursor: pointer;
`;

const FileInput = styled.input`
  display: none;
`;

const FileText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 60px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 17px;
  font-weight: 700;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;
