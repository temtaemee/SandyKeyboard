import { useState } from 'react';
import styled from 'styled-components';

const MOCK_IS_LOGGED_IN = false;
// 📌 실제 연동 시: import { useAuth } from '../../../../context/AuthContext';

const coupons = [
  {
    id: 1,
    label: '신규 가입 축하 쿠폰',
    discount: 10,
    description: '첫 예약 시 10% 할인',
    expiry: '2026.06.30',
    bg: '#c3edf6',
    color: '#2c6480',
  },
  {
    id: 2,
    label: '봄 시즌 특별 쿠폰',
    discount: 20,
    description: '5월 한 달 예약 시 20% 할인',
    expiry: '2026.05.31',
    bg: '#f6e5ba',
    color: '#92640a',
  },
  {
    id: 3,
    label: '주말 특가 쿠폰',
    discount: 15,
    description: '주말 예약 한정 15% 할인',
    expiry: '2026.06.15',
    bg: '#e0f2e9',
    color: '#276749',
  },
  {
    id: 4,
    label: '장기 이용 감사 쿠폰',
    discount: 25,
    description: '3박 이상 예약 시 25% 할인',
    expiry: '2026.07.31',
    bg: '#ede9fe',
    color: '#5b21b6',
  },
];

const btnColors = {
  idle: { bg: '#2c6480', hover: '#3d8aaa' },
  issued: { bg: '#22c55e', hover: '#16a34a' },
  notLoggedIn: { bg: '#ef4444', hover: '#dc2626' },
  duplicate: { bg: '#f97316', hover: '#ea580c' },
};

export default function EventPage() {
  const [issuedIds, setIssuedIds] = useState([]);
  const [btnState, setBtnState] = useState({});

  function handleIssue(id) {
    if (!MOCK_IS_LOGGED_IN) {
      setBtnState((p) => ({ ...p, [id]: 'notLoggedIn' }));
      setTimeout(() => setBtnState((p) => ({ ...p, [id]: 'idle' })), 2500);
      return;
    }
    if (issuedIds.includes(id)) {
      setBtnState((p) => ({ ...p, [id]: 'duplicate' }));
      setTimeout(() => setBtnState((p) => ({ ...p, [id]: 'idle' })), 2500);
      return;
    }
    setIssuedIds((p) => [...p, id]);
    setBtnState((p) => ({ ...p, [id]: 'issued' }));
  }

  function getLabel(id) {
    const s = btnState[id] || 'idle';
    if (s === 'notLoggedIn') return '🔒 로그인이 필요합니다';
    if (s === 'duplicate') return '이미 발급된 쿠폰입니다';
    if (issuedIds.includes(id)) return '✓ 발급완료';
    return '쿠폰 받기';
  }

  function getStyle(id) {
    const s = btnState[id] || 'idle';
    if (s === 'notLoggedIn') return 'notLoggedIn';
    if (s === 'duplicate') return 'duplicate';
    if (issuedIds.includes(id)) return 'issued';
    return 'idle';
  }

  return (
    <Wrapper>
      <PageTitle>이벤트 &amp; 쿠폰</PageTitle>
      <PageSubTitle>쿠폰을 발급받아 예약 시 할인 혜택을 누리세요</PageSubTitle>

      <Grid>
        {coupons.map((coupon) => (
          <CouponCard key={coupon.id} $bg={coupon.bg}>
            <CardTop $color={coupon.color}>
              <Badge $color={coupon.color}>{coupon.discount}% OFF</Badge>
              <CouponName>{coupon.label}</CouponName>
              <CouponDesc>{coupon.description}</CouponDesc>
            </CardTop>

            <Perforation>
              <Notch className="left" />
              <DashLine />
              <Notch className="right" />
            </Perforation>

            <CardBottom>
              <Expiry>유효기간 · {coupon.expiry}까지</Expiry>
              <IssueBtn
                $s={getStyle(coupon.id)}
                onClick={() => handleIssue(coupon.id)}
                disabled={issuedIds.includes(coupon.id)}
              >
                {getLabel(coupon.id)}
              </IssueBtn>
            </CardBottom>
          </CouponCard>
        ))}
      </Grid>

      <CautionBox>
        <CautionTitle>쿠폰 유의사항</CautionTitle>
        <CautionList>
          <li>
            쿠폰은 예약 결제 시 보유 쿠폰 목록에서 선택해 적용할 수 있습니다.
          </li>
          <li>쿠폰은 1회 예약에 1장만 사용 가능합니다.</li>
          <li>동일한 쿠폰은 중복 발급되지 않습니다.</li>
          <li>유효기간이 지난 쿠폰은 사용이 불가합니다.</li>
        </CautionList>
      </CautionBox>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  font-family: ${({ theme }) => theme.fonts.base};
`;

const PageTitle = styled.h1`
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.textDark};
`;

const PageSubTitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMid};
  margin-bottom: 48px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 64px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CouponCard = styled.div`
  background: ${({ $bg }) => $bg};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;

const CardTop = styled.div`
  padding: 32px 28px 24px;
  color: ${({ $color }) => $color};
`;

const Badge = styled.div`
  display: inline-block;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
  background: ${({ $color }) => $color};
  color: white;
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radius.full};
  margin-bottom: 16px;
`;

const CouponName = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
`;
const CouponDesc = styled.div`
  font-size: 14px;
  opacity: 0.8;
`;

const Perforation = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 -1px;
  .left {
    left: -12px;
  }
  .right {
    right: -12px;
  }
`;

const Notch = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  background: ${({ theme }) => theme.colors.bg};
  border-radius: 50%;
`;

const DashLine = styled.div`
  width: 100%;
  border-top: 2px dashed rgba(0, 0, 0, 0.1);
`;

const CardBottom = styled.div`
  padding: 20px 28px 28px;
  background: rgba(255, 255, 255, 0.5);
`;

const Expiry = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 12px;
`;

const IssueBtn = styled.button`
  width: 100%;
  padding: 12px 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: none;
  background: ${({ $s }) => btnColors[$s]?.bg || '#2c6480'};
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transition: background 0.2s;
  font-family: ${({ theme }) => theme.fonts.base};
  &:hover {
    background: ${({ $s, disabled }) =>
      disabled ? btnColors['issued'].bg : btnColors[$s]?.hover};
  }
`;

const CautionBox = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.textDark};
  padding-top: 32px;
`;

const CautionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.textDark};
`;

const CautionList = styled.ul`
  list-style: disc;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  li {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textMid};
    line-height: 1.6;
  }
`;
