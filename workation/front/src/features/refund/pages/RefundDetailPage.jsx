import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { refundApi } from '../api/refundApi';
import styled from 'styled-components';

export default function RefundDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const reasonMapper = {
    SIMPLE_CHANGE: '단순변심',
    SCHEDULE_CHANGE: '일정변경',
    PRODUCT_CHANGE: '상품변경',
    METHOD_CHANGE: '결제수단변경',
  };

  useEffect(() => {
    const loadDetail = async () => {
      try {
        let data;
        if (window.location.pathname.startsWith('/admin')) {
          data = await refundApi.getAdminRefundDetail(id);
        } else if (window.location.pathname.startsWith('/seller')) {
          data = await refundApi.getSellerRefundDetail(id);
        } else {
          data = await refundApi.getUserRefundDetail(id);
        }
        setDetail(data);
      } catch (error) {
        alert('환불 상세 정보를 가져오는 데 실패했습니다.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id, navigate]);

  if (loading) return <CenterText>환불 내역 로딩 중...</CenterText>;
  if (!detail) return <CenterText>데이터가 존재하지 않습니다.</CenterText>;

  // 현재 관리자 모드인지 판별하여 테마 색상 분기
  const isAdmin = window.location.pathname.startsWith('/admin');

  return (
    <DetailContainer>
      <TitleZone>
        <h2> 환불 상세 영수증 / 내역</h2>
        <span className="badge">환불완료</span>
      </TitleZone>

      <Section>
        <h3>1. 환불 처리 정보</h3>
        <InfoTable>
          <tbody>
            <tr>
              <th>환불 총 금액</th>
              <td className="price">
                {detail.refundAmount?.toLocaleString()}원
              </td>
            </tr>
            <tr>
              <th>환불 사유</th>
              <td>
                {reasonMapper[detail.refundReason] || detail.refundReason}
              </td>
            </tr>
            <tr>
              <th>토스 거래 키 (고유)</th>
              <td className="key">{detail.transactionKey}</td>
            </tr>
            <tr>
              <th>취소 일시</th>
              <td>{new Date(detail.refundedAt).toLocaleString()}</td>
            </tr>
          </tbody>
        </InfoTable>
      </Section>

      <Section>
        <h3>2. 원본 예약 내역 정보</h3>
        <InfoTable>
          <tbody>
            <tr>
              <th>예약 번호 / 주문 번호</th>
              <td>
                ID: {detail.reservationId} / {detail.orderId}
              </td>
            </tr>
            <tr>
              <th>숙소 정보</th>
              <td>
                <strong>{detail.stay?.name || '상품 정보 없음'}</strong>
              </td>
            </tr>
            <tr>
              <th>예약자 정보</th>
              <td>
                {detail.primaryGuestName} ({detail.primaryGuestPhone})
              </td>
            </tr>
            <tr>
              <th>이용 일정</th>
              <td>
                {detail.checkinDate} ~ {detail.checkoutDate} (
                {detail.guestCount}명)
              </td>
            </tr>
          </tbody>
        </InfoTable>
      </Section>

      <BackButton $isAdmin={isAdmin} onClick={() => navigate(-1)}>
        뒤로 가기
      </BackButton>
    </DetailContainer>
  );
}

// ================= Styled Components =================
const DetailContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid replace;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const TitleZone = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid ${({ theme }) => theme.colors.textDark};
  padding-bottom: 15px;

  h2 {
    color: ${({ theme }) => theme.colors.textDark};
    font-size: 22px;
  }

  .badge {
    background: ${({ theme }) => theme.colors.accentYellow};
    color: ${({ theme }) => theme.colors.textDark};
    padding: 6px 16px;
    font-weight: bold;
    border-radius: ${({ theme }) => theme.radius.full};
    font-size: 14px;
  }
`;

const Section = styled.div`
  margin-top: 35px;
  h3 {
    font-size: 18px;
    color: ${({ theme }) => theme.colors.textDark};
    margin-bottom: 16px;
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
    padding-left: 10px;
  }
`;

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 14px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
    text-align: left;
    font-size: 15px;
  }

  th {
    width: 25%;
    background: ${({ theme }) => theme.colors.bgSection};
    color: ${({ theme }) => theme.colors.textMid};
    font-weight: 600;
  }

  td {
    color: ${({ theme }) => theme.colors.textDark};
  }

  .price {
    color: ${({ theme }) => theme.colors.primary};
    font-family: ${({ theme }) => theme.fonts.number};
    font-weight: 700;
    font-size: 20px;
  }

  .key {
    font-family: 'Courier New', monospace;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const BackButton = styled.button`
  width: 100%;
  margin-top: 40px;
  padding: 14px;
  background: ${({ theme, $isAdmin }) =>
    $isAdmin ? theme.colors.adminPrimary : theme.colors.textMid};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 16px;
  font-weight: bold;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme, $isAdmin }) =>
      $isAdmin ? theme.colors.adminPrimaryLight : theme.colors.textDark};
  }
`;

const CenterText = styled.div`
  text-align: center;
  padding: 60px;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textMid};
`;
