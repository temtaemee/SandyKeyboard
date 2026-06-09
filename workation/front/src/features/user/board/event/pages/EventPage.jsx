import React, { useState, useEffect } from 'react';
import eventBanner from '../assets/신규회원.png';
import returnBanner from '../assets/복귀자.png';
import reviewBanner from '../assets/베스트리뷰자.png';
import '../styles/EventPage.css';
import { getCouponDetail, receiveCoupon } from '../api/eventApi';

// ⚠️ DB에 등록된 실제 쿠폰 ID로 변경해주세요
const COUPON_IDS = {
  NEW_MEMBER: 1, // WELCOME-10
  RETURN: 2, // BIRTHDAY-20
  BEST_REVIEW: 3, // BEST_REVIEW_20
  INVITE: 4, // INVITE_10
};

const EventPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [receiving, setReceiving] = useState(false);

  // 쿠폰 받기 버튼 클릭 → 모달 열기
  const openCouponModal = (couponId) => {
    setSelectedCouponId(couponId);
    setCoupon(null); // 이전 쿠폰 정보 초기화
    setShowCouponModal(true);
  };

  // 모달 열릴 때 쿠폰 정보 조회
  useEffect(() => {
    if (showCouponModal && selectedCouponId) {
      getCouponDetail(selectedCouponId)
        .then((data) => setCoupon(data))
        .catch(() => setCoupon(null));
    }
  }, [showCouponModal, selectedCouponId]);

  // 쿠폰 발급 처리
  const handleReceiveCoupon = async () => {
    if (receiving) return;
    setReceiving(true);
    try {
      await receiveCoupon(selectedCouponId);
      alert('쿠폰이 발급되었습니다! 마이페이지에서 확인하세요.');
      setShowCouponModal(false);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        alert('로그인 후 이용해주세요.');
      } else if (status === 409) {
        alert('이미 발급받은 쿠폰입니다.');
      } else {
        alert('쿠폰 발급에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setReceiving(false);
    }
  };

  const events = [
    {
      id: 0,
      type: 'image',
      couponId: COUPON_IDS.NEW_MEMBER,
      alt: '신규회원 이벤트',
      src: eventBanner,
      btnLabel: '🎁 신규회원 쿠폰 받기',
    },
    {
      id: 1,
      type: 'image2',
      couponId: COUPON_IDS.RETURN,
      alt: '복귀자 이벤트',
      src: returnBanner,
      btnLabel: '🎁 복귀자 쿠폰 받기',
    },
    {
      id: 2,
      type: 'image3',
      couponId: COUPON_IDS.BEST_REVIEW,
      alt: '베스트리뷰자 이벤트',
      src: reviewBanner,
      btnLabel: '🎁 베스트리뷰 쿠폰 받기',
    },
    {
      id: 3,
      type: 'card',
      couponId: COUPON_IDS.INVITE,
      btnLabel: '🎁 초대 쿠폰 받기',
      title: '지인 초대 이벤트',
      subTitle: '친구도 나도 함께 받는 혜택',
      discount: '둘 다 5,000원 적립',
      desc: '초대 링크를 통해 친구가 가입하면 두 분 모두에게 즉시 적립금을 드립니다.',
      bgClass: 'bg-orange',
      tag: 'INVITE',
    },
  ];

  const nextSlide = () => {
    if (currentIndex < events.length - 1) setCurrentIndex(currentIndex + 1);
  };
  const prevSlide = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="slider-wrapper">
      <div className="slider-header">
        <h2 className="slider-title">진행 중인 이벤트</h2>
        <span className="slider-page-indicator">
          {currentIndex + 1} / {events.length}
        </span>
      </div>

      <div className="slider-container">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {events.map((event) =>
            event.type === 'card' ? (
              // ── 일반 카드 슬라이드 (4번) ──
              <div key={event.id} className={`slide-card ${event.bgClass}`}>
                <div className="card-top">
                  <span className="card-tag">{event.tag}</span>
                  <p className="card-subtitle">{event.subTitle}</p>
                  <h3 className="card-main-title">{event.title}</h3>
                </div>
                <div className="card-coupon">
                  <span className="coupon-discount">{event.discount}</span>
                  <span className="coupon-sub">COUPON BENEFIT</span>
                </div>
                <div className="card-bottom">
                  <p className="card-desc">{event.desc}</p>
                  {/* 카드형 쿠폰 받기 버튼 */}
                  <button
                    className="card-btn"
                    onClick={() => openCouponModal(event.couponId)}
                  >
                    {event.btnLabel}
                  </button>
                </div>
              </div>
            ) : (
              // ── 이미지 슬라이드 (1~3번) ──
              <div key={event.id} className="slide-card slide-image-card">
                <img
                  src={event.src}
                  alt={event.alt}
                  className="event-banner-img"
                />
                <button
                  className="coupon-receive-btn"
                  onClick={() => openCouponModal(event.couponId)}
                >
                  {event.btnLabel}
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {currentIndex > 0 && (
        <button onClick={prevSlide} className="nav-btn prev-btn">
          &lt;
        </button>
      )}
      {currentIndex < events.length - 1 && (
        <button onClick={nextSlide} className="nav-btn next-btn">
          &gt;
        </button>
      )}

      <div className="dot-container">
        {events.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`dot ${currentIndex === idx ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* 쿠폰 모달 */}
      {showCouponModal && (
        <div
          className="coupon-modal-overlay"
          onClick={() => setShowCouponModal(false)}
        >
          <div className="coupon-modal" onClick={(e) => e.stopPropagation()}>
            <div className="coupon-modal-header">
              <span className="coupon-modal-emoji">🎉</span>
              <h3 className="coupon-modal-title">
                {coupon ? coupon.couponName : '쿠폰 불러오는 중...'}
              </h3>
              <p className="coupon-modal-desc">
                아래 쿠폰을 발급받으세요.
                <br />
                마이페이지에서 확인 가능합니다.
              </p>
            </div>
            <div className="coupon-modal-card">
              <div className="coupon-modal-discount">
                {coupon ? `${coupon.discountRate}%` : '...'}
              </div>
              <div className="coupon-modal-label">
                {coupon ? coupon.couponName : ''}
              </div>
              <div className="coupon-modal-code">
                {coupon ? coupon.couponCode : ''}
              </div>
            </div>
            <button
              className="coupon-modal-btn"
              onClick={handleReceiveCoupon}
              disabled={receiving || !coupon}
            >
              {receiving ? '발급 중...' : '쿠폰 발급받기'}
            </button>
            <button
              className="coupon-modal-close"
              onClick={() => setShowCouponModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPage;
