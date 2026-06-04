import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

import useReservationInsert from '../hooks/useReservationInsert';
import { getAvailableCoupons, getBookedDates } from '../api/reservationApi';

function ReservationInsertPage() {
  const clientKey = 'test_ck_5OWRapdA8djRAOLzPxRYVo1zEqZK';
  const { stayId } = useParams();
  const { insertReservation } = useReservationInsert();

  const [coupons, setCoupons] = useState([]);
  const [excludeDates, setExcludeDates] = useState([]);
  const [bookingStartDates, setBookingStartDates] = useState([]); // 예약 시작일들 저장용

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
    async function initPageData() {
      try {
        const couponResp = await getAvailableCoupons();
        setCoupons(couponResp.data.content || []);

        const datesResp = await getBookedDates(stayId);

        const parsedDates = [];
        const startDates = [];

        datesResp.data.forEach((range) => {
          let current = new Date(range.checkin);
          const end = new Date(range.checkout);

          startDates.push(new Date(range.checkin));

          // 기존 예약 기간은 달력에서 막음 (체크아웃 당일은 선택 가능해야 하므로 < 로 유지)
          while (current < end) {
            parsedDates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        });
        setExcludeDates(parsedDates);
        setBookingStartDates(startDates);
      } catch (err) {
        console.error('데이터 로딩 오류:', err);
      }
    }
    initPageData();
  }, [stayId]);

  // 체크인 날짜 이후의 가장 가까운 예약 시작일을 찾음
  const getNextAvailableLimit = (checkinDateStr) => {
    if (!checkinDateStr) return null;
    const checkin = new Date(checkinDateStr);

    const futureBookings = bookingStartDates
      .filter((date) => date > checkin)
      .sort((a, b) => a - b);

    return futureBookings.length > 0 ? futureBookings[0] : null;
  };

  function handleChange(e) {
    setVo({ ...vo, [e.target.name]: e.target.value });
  }

  const handleDateChange = (date, fieldName) => {
    if (!date) {
      setVo((prev) => ({ ...prev, [fieldName]: '' }));
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setVo((prev) => ({ ...prev, [fieldName]: formattedDate }));
  };

  function handleFileChange(e) {
    setFileList([...e.target.files]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!vo.checkinDate || !vo.checkoutDate) {
      alert('날짜를 선택해 주세요.');
      return;
    }
    try {
      const { reservationId, totalPrice } = await insertReservation(
        stayId,
        vo,
        fileList
      );
      await requestPayment(reservationId, totalPrice);
    } catch (err) {
      alert(err.response?.data?.message || '예약 처리 중 오류가 발생했습니다.');
    }
  }

  async function requestPayment(reservationId, totalPrice) {
    const tossPayments = await loadTossPayments(clientKey);
    await tossPayments.requestPayment('CARD', {
      amount: totalPrice,
      orderId: `ORDER_${reservationId}_${Date.now()}`,
      orderName: '숙소 예약 결제',
      customerName: vo.primaryGuestName,
      customerEmail: vo.primaryGuestEmail,
      successUrl: `${window.location.origin}/resv/payment/success?reservationId=${reservationId}`,
      failUrl: `${window.location.origin}/payment/fail`,
    });
  }
  return (
    <Wrapper>
      <Container>
        <Title>예약 / 결제</Title>
        <StyledForm onSubmit={handleSubmit}>
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
                min="1"
                value={vo.guestCount}
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <Label>대표 예약자 이름</Label>
              <Input
                type="text"
                name="primaryGuestName"
                value={vo.primaryGuestName}
                onChange={handleChange}
                required
              />
            </InputGroup>
            <Row>
              <InputGroup>
                <Label>체크인 날짜</Label>
                <DatePickerWrapper>
                  <StyledDatePicker
                    locale={ko}
                    dateFormat="yyyy-MM-dd"
                    selected={vo.checkinDate ? new Date(vo.checkinDate) : null}
                    onChange={(date) => handleDateChange(date, 'checkinDate')}
                    minDate={new Date()}
                    excludeDates={excludeDates}
                    placeholderText="체크인 선택"
                    required
                  />
                </DatePickerWrapper>
              </InputGroup>
              <InputGroup>
                <Label>체크아웃 날짜</Label>
                <DatePickerWrapper>
                  <StyledDatePicker
                    locale={ko}
                    dateFormat="yyyy-MM-dd"
                    selected={
                      vo.checkoutDate ? new Date(vo.checkoutDate) : null
                    }
                    onChange={(date) => handleDateChange(date, 'checkoutDate')}
                    minDate={
                      vo.checkinDate
                        ? new Date(
                            new Date(vo.checkinDate).setDate(
                              new Date(vo.checkinDate).getDate() + 1
                            )
                          )
                        : new Date(new Date().setDate(new Date().getDate() + 1))
                    }
                    // 💡 2. 체크아웃은 다음 예약 시작일까지만 선택 가능
                    maxDate={getNextAvailableLimit(vo.checkinDate)}
                    placeholderText="체크아웃 선택"
                    required
                  />
                </DatePickerWrapper>
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
                required
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
                required
              />
            </InputGroup>
          </Section>

          {/* 지원금 수령 계좌 */}
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

/* ========================================================================= */
/* Styled Components 확장 (DatePicker 가로 정렬 이슈 방지 랩퍼 추가) */
/* ========================================================================= */

// react-datepicker가 부모 block 요소를 다 채우지 못해 가로 배치가 찌그러지는 현상 방지용 랩퍼 추가
const DatePickerWrapper = styled.div`
  width: 100%;
  .react-datepicker-wrapper {
    width: 100%;
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  height: 54px;
  padding: 0 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  font-size: 15px;
  color: #1a202c;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2c6480;
    box-shadow: 0 0 0 4px rgba(44, 100, 128, 0.12);
  }
`;

/* 기존 UI 스타일 코드 유지 */
const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 80px 20px;
  background: #fafafa;
`;
const Container = styled.div`
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  background: #fff;
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;
const Title = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #1a202c;
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
  border-bottom: 1px solid #edf2f7;
`;
const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1a202c;
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
  color: #4a5568;
`;
const Select = styled.select`
  width: 100%;
  height: 54px;
  padding: 0 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  font-size: 15px;
`;
const Input = styled.input`
  width: 100%;
  height: 54px;
  padding: 0 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  font-size: 15px;
  color: #1a202c;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2c6480;
    box-shadow: 0 0 0 4px rgba(44, 100, 128, 0.12);
  }
`; // 💡 닫는 백틱과 세미콜론이 누락되지 않도록 결합

const FileBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const FileLabel = styled.label`
  width: fit-content;
  padding: 12px 20px;
  border-radius: 20px;
  background: #edf2f7;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const FileInput = styled.input`
  display: none;
`;

const FileText = styled.p`
  font-size: 14px;
  color: #718096;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 60px;
  border-radius: 30px;
  background: #2c6480;
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: #1e4559;
  }
`;
