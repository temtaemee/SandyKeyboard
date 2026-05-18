// src/features/reservation/pages/ReservationInsertPage.jsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { createReservation } from '../api/reservationApi';

import { setError, setLoading } from '../store/reservationSlice';

function ReservationInsertPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [vo, setVo] = useState({
    couponId: '',
    guestCount: 1,
    primaryGuestName: '',
    checkinDate: '',
    checkoutDate: '',
    primaryGuestPhone: '',
    primaryGuestEmail: '',
  });

  // URL 용
  const [productType, setProductType] = useState('STAY');
  const [productId, setProductId] = useState(1);

  // 첨부파일
  const [fileList, setFileList] = useState([]);

  // input 변경
  function handleChange(e) {
    setVo({
      ...vo,
      [e.target.name]: e.target.value,
    });
  }

  // 파일 변경
  function handleFileChange(e) {
    setFileList([...e.target.files]);
  }

  // 예약 등록
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      dispatch(setLoading(true));

      const formData = new FormData();

      // dto 를 JSON Blob 으로 전송
      formData.append(
        'data',
        new Blob([JSON.stringify(vo)], {
          type: 'application/json',
        })
      );

      // 파일 추가
      fileList.forEach((file) => {
        formData.append('fileList', file);
      });

      // stay,office 완성후 넣기 productType, productId,
      const resp = await createReservation(formData);

      alert('예약 성공');

      console.log(resp.data);

      navigate('/');
    } catch (error) {
      console.error(error);

      dispatch(setError(error.response?.data));

      alert('예약 실패');
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <div>
      <h1>예약하기</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="number"
            name="couponId"
            placeholder="쿠폰 ID"
            value={vo.couponId}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="number"
            name="guestCount"
            placeholder="인원 수"
            value={vo.guestCount}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            name="primaryGuestName"
            placeholder="대표투숙객 이름"
            value={vo.primaryGuestName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>체크인 날짜</label>

          <input
            type="datetime-local"
            name="checkinDate"
            value={vo.checkinDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>체크아웃 날짜</label>

          <input
            type="datetime-local"
            name="checkoutDate"
            value={vo.checkoutDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            name="primaryGuestPhone"
            placeholder="대표투숙객 전화번호"
            value={vo.primaryGuestPhone}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="email"
            name="primaryGuestEmail"
            placeholder="대표투숙객 이메일"
            value={vo.primaryGuestEmail}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="file-input">파일첨부</label>
          <input
            id="file-input"
            type="file"
            name="f"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        <div>
          <button type="submit">예약하기</button>
        </div>
      </form>
    </div>
  );
}

export default ReservationInsertPage;
