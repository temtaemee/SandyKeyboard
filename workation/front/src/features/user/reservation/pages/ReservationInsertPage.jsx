// src/features/reservation/pages/ReservationInsertPage.jsx

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import useReservationInsert from '../hooks/useReservationInsert';

function ReservationInsertPage() {
  const { stayId } = useParams();

  const { insertReservation } = useReservationInsert();

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

    await insertReservation(stayId, vo, fileList);
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
              <Label>쿠폰 ID</Label>

              <Input
                type="number"
                name="couponId"
                placeholder="쿠폰 ID 입력"
                value={vo.couponId}
                onChange={handleChange}
              />
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
