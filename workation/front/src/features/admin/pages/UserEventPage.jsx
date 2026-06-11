import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { ChevronLeft, ChevronRight, Ticket, AlertCircle } from 'lucide-react';
import { getPublicEventList, receiveCoupon } from '../api/userEventApi';

export default function UserEventPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modal, setModal] = useState(null); // null | 'confirm' | 'result'
  const [resultMsg, setResultMsg] = useState('');
  const [resultOk, setResultOk] = useState(true);
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    getPublicEventList()
      .then((data) => {
        const list = Array.isArray(data) ? data : data.content || [];
        setEvents(list.filter((e) => e.delYn === 'N' || !e.delYn));
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const prev = useCallback(() => setCurrentIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(
    () => setCurrentIndex((i) => Math.min(events.length - 1, i + 1)),
    [events.length]
  );

  const activeEvent = events[currentIndex] ?? null;

  const handleCouponClick = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인 후 이용해주세요.');
      navigate('/login');
      return;
    }
    if (!activeEvent?.couponId || issuing) return;
    setIssuing(true);
    try {
      await receiveCoupon(activeEvent.couponId);
      setResultOk(true);
      setResultMsg('쿠폰이 발급되었습니다!\n마이페이지에서 확인하세요.');
    } catch (err) {
      const message = err.response?.data?.message ?? '';
      setResultOk(false);
      if (message.includes('이미 발급받은')) {
        setResultMsg('이미 발급받은 쿠폰입니다.');
      } else if (message.includes('수량')) {
        setResultMsg('쿠폰 수량이 모두 소진되었습니다.');
      } else {
        setResultMsg('쿠폰 발급에 실패했습니다.\n잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIssuing(false);
      setModal('result');
    }
  };

  if (loading) {
    return (
      <Wrapper>
        <LoadingText>이벤트를 불러오는 중...</LoadingText>
      </Wrapper>
    );
  }

  if (events.length === 0) {
    return (
      <Wrapper>
        <EmptyState>
          <AlertCircle size={40} color="#94a3b8" />
          <p>진행 중인 이벤트가 없습니다.</p>
        </EmptyState>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {/* ── 헤더 ── */}
      <Header>
        <Title>진행 중인 이벤트</Title>
        <Indicator>
          {currentIndex + 1} / {events.length}
        </Indicator>
      </Header>

      {/* ── 슬라이더 ── */}
      <SliderOuter>
        <Track style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {events.map((ev) => (
            <Slide key={ev.id}>
              {/* 이벤트 제목 */}
              <SlideTitle>{ev.title}</SlideTitle>

              {/* 본문 */}
              <SlideContent>{ev.content}</SlideContent>

              {/* 쿠폰 정보 */}
              {ev.couponId && (
                <CouponCard>
                  <CouponCardLeft>
                    <Ticket size={18} color="#f59e0b" />
                    <CouponName>{ev.couponName}</CouponName>
                  </CouponCardLeft>
                  <CouponCardRight>
                    <CouponRate>{ev.couponDiscountRate ?? ''}%</CouponRate>
                  </CouponCardRight>
                  <CouponMeta>
                    <CouponMetaItem>
                      <MetaLabel>할인율</MetaLabel>
                      <MetaValue>{ev.couponDiscountRate ?? '-'}%</MetaValue>
                    </CouponMetaItem>
                    <CouponMetaItem>
                      <MetaLabel>잔여 수량</MetaLabel>
                      <MetaValue>{ev.couponRemainQty ?? '-'}매</MetaValue>
                    </CouponMetaItem>
                    <CouponMetaItem>
                      <MetaLabel>유효 기간</MetaLabel>
                      <MetaValue>
                        {ev.couponValidDays != null ? `발급 후 ${ev.couponValidDays}일` : '무기한'}
                      </MetaValue>
                    </CouponMetaItem>
                  </CouponMeta>
                </CouponCard>
              )}
            </Slide>
          ))}
        </Track>

        {/* 좌우 화살표 */}
        {currentIndex > 0 && (
          <NavBtn $side="left" onClick={prev}>
            <ChevronLeft size={20} />
          </NavBtn>
        )}
        {currentIndex < events.length - 1 && (
          <NavBtn $side="right" onClick={next}>
            <ChevronRight size={20} />
          </NavBtn>
        )}
      </SliderOuter>

      {/* ── 점 인디케이터 ── */}
      <Dots>
        {events.map((_, idx) => (
          <Dot key={idx} $active={idx === currentIndex} onClick={() => setCurrentIndex(idx)} />
        ))}
      </Dots>

      {/* ── 쿠폰 발급 버튼 (쿠폰 있을 때만 표시) ── */}
      {activeEvent?.couponId && (
        <IssueBtn onClick={handleCouponClick}>
          <Ticket size={16} />
          {activeEvent.couponName} 쿠폰 받기
        </IssueBtn>
      )}

      {/* ── 발급 결과 모달 ── */}
      {modal === 'result' && (
        <Overlay onClick={() => setModal(null)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalEmoji>{resultOk ? '✅' : '⚠️'}</ModalEmoji>
            <ModalResultMsg $ok={resultOk}>{resultMsg}</ModalResultMsg>
            <ModalConfirmBtn onClick={() => setModal(null)} style={{ width: '100%' }}>
              확인
            </ModalConfirmBtn>
          </ModalBox>
        </Overlay>
      )}
    </Wrapper>
  );
}

/* ── Styled Components ── */

const Wrapper = styled.div`
  max-width: 860px;
  margin: 40px auto;
  padding: 32px 28px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.08),
    0 2px 4px -1px rgba(0, 0, 0, 0.04);
  font-family: inherit;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #0d1c2e;
  margin: 0;
`;

const Indicator = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 999px;
`;

const SliderOuter = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
`;

const Track = styled.div`
  display: flex;
  transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Slide = styled.div`
  min-width: 100%;
  padding: 36px 40px;
  background: linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SlideTitle = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: #0d1c2e;
  margin: 0;
  line-height: 1.35;
`;

const SlideContent = styled.p`
  font-size: 15px;
  color: #475569;
  line-height: 1.7;
  margin: 0;
  white-space: pre-wrap;
`;

const CouponCard = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 12px 0;
  padding: 20px 24px;
  background: linear-gradient(135deg, #0f0c29, #302b63);
  border-radius: 14px;
  color: white;
  position: relative;
  overflow: hidden;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    background: #f1f5f9;
    border-radius: 50%;
  }
  &::before { left: -9px; }
  &::after  { right: -9px; }
`;

const CouponCardLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CouponName = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
`;

const CouponCardRight = styled.div`
  display: flex;
  align-items: center;
`;

const CouponRate = styled.span`
  font-size: 32px;
  font-weight: 900;
  color: #f59e0b;
  line-height: 1;
`;

const CouponMeta = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
`;

const CouponMetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const MetaLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetaValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
`;

const NoCouponNote = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  color: #94a3b8;
  padding: 14px 18px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px dashed #e2e8f0;
`;

const NavBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $side }) => ($side === 'left' ? 'left: 12px;' : 'right: 12px;')}
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background 0.15s, box-shadow 0.15s;
  z-index: 5;

  &:hover {
    background: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
`;

const Dot = styled.button`
  width: ${({ $active }) => ($active ? '24px' : '8px')};
  height: 8px;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? '#244c54' : '#d1d5db')};
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s;
`;

const IssueBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 24px;
  padding: 15px 0;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  border: none;
  background: linear-gradient(90deg, #7dd3fc, #fde68a);
  color: #0d1c2e;
  box-shadow: 0 4px 20px rgba(125, 211, 252, 0.35);

  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
  &:active {
    transform: scale(0.98);
  }
`;

const popIn = keyframes`
  from { transform: scale(0.88); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  backdrop-filter: blur(4px);
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 24px;
  padding: 36px 32px;
  width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  animation: ${popIn} 0.22s ease-out;
`;

const ModalEmoji = styled.span`
  font-size: 42px;
  line-height: 1;
`;


const ModalConfirmBtn = styled.button`
  flex: 1;
  padding: 13px 0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  border: none;
  background: linear-gradient(90deg, #7dd3fc, #fde68a);
  color: #0d1c2e;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.88;
  }
`;

const ModalResultMsg = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: ${({ $ok }) => ($ok ? '#16a34a' : '#dc2626')};
  text-align: center;
  white-space: pre-line;
  margin: 0;
  line-height: 1.6;
`;

const LoadingText = styled.p`
  text-align: center;
  color: #94a3b8;
  padding: 60px 0;
  font-size: 14px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 0;
  color: #94a3b8;
  font-size: 14px;
`;
