import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { getReservationOne } from '../api/reservationApi';
import useReservationUpdate from '../hooks/useReservationUpdate';

export default function ReservationUpdatePage() {
  const { id } = useParams();
  const { modifyReservation } = useReservationUpdate();

  const [vo, setVo] = useState({
    primaryGuestName: '',
    primaryGuestPhone: '',
    primaryGuestEmail: '',
    refundBankName: '',
    refundAccountNumber: '',
    refundAccountHolder: '',
  });

  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // 기존 데이터 조회
  // =========================
  useEffect(() => {
    async function loadReservation() {
      try {
        setLoading(true);

        const resp = await getReservationOne(id);
        const data = resp.data;

        setVo({
          primaryGuestName: data?.primaryGuestName || '',
          primaryGuestPhone: data?.primaryGuestPhone || '',
          primaryGuestEmail: data?.primaryGuestEmail || '',
          refundBankName: data?.refundBankName || '',
          refundAccountNumber: data?.refundAccountNumber || '',
          refundAccountHolder: data?.refundAccountHolder || '',
        });
      } catch (error) {
        console.error(error);
        alert('예약 조회 실패');
      } finally {
        setLoading(false);
      }
    }

    if (id) loadReservation();
  }, [id]);

  // =========================
  // input 변경
  // =========================
  function handleChange(e) {
    const { name, value } = e.target;

    setVo((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // =========================
  // 파일 변경
  // =========================
  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    setFileList(files);
  }

  // =========================
  // submit
  // =========================
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await modifyReservation(id, vo, fileList);

      alert('수정 완료');
    } catch (error) {
      console.error(error);
      alert('수정 실패');
    }
  }

  if (loading) {
    return <Wrapper>로딩중...</Wrapper>;
  }

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <input
          name="primaryGuestName"
          value={vo.primaryGuestName}
          onChange={handleChange}
          placeholder="이름"
        />

        <input
          name="primaryGuestPhone"
          value={vo.primaryGuestPhone}
          onChange={handleChange}
          placeholder="전화번호"
        />

        <input
          name="primaryGuestEmail"
          value={vo.primaryGuestEmail}
          onChange={handleChange}
          placeholder="이메일"
        />

        <input
          name="refundBankName"
          value={vo.refundBankName}
          onChange={handleChange}
          placeholder="은행명"
        />

        <input
          name="refundAccountNumber"
          value={vo.refundAccountNumber}
          onChange={handleChange}
          placeholder="계좌번호"
        />

        <input
          name="refundAccountHolder"
          value={vo.refundAccountHolder}
          onChange={handleChange}
          placeholder="예금주"
        />

        <input type="file" multiple onChange={handleFileChange} />

        <button type="submit">수정</button>
      </form>
    </Wrapper>
  );
}

const Wrapper = styled.div``;
