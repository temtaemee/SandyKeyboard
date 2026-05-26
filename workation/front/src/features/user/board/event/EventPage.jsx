import React, { useState } from 'react';
import eventBanner from '../assets/신규회원.png';
import returnBanner from '../assets/복귀자.png';
import reviewBanner from '../assets/베스트리뷰자.png';
import './EventPage.css';
  
const EventPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const events = [
    {
      id: 0,
      type: 'image', // 이미지 슬라이드
    },
    {
      id: 1,
      type: 'image2', // 복귀자 이미지 슬라이드
    },
    {
      id: 2,
      type: 'image3', // 베스트리뷰자 이미지 슬라이드
    },
    {
      id: 3,
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
      {/* 상단 타이틀 및 페이지 표시 */}
      <div className="slider-header">
        <h2 className="slider-title">진행 중인 이벤트</h2>
        <span className="slider-page-indicator">
          {currentIndex + 1} / {events.length}
        </span>
      </div>

      {/* 슬라이더 본체 */}
      <div className="slider-container">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {events.map((event) =>
            event.type === 'image' ? (
              /* ── 1페이지 이미지 슬라이드 ── */
              <div key={event.id} className="slide-card slide-image-card">
                <img
                  src={eventBanner}
                  alt="회원가입 이벤트"
                  className="event-banner-img"
                />
                <button
                  className="coupon-receive-btn"
                  onClick={() => setShowCouponModal(true)}
                >
                  🎁 쿠폰 받기
                </button>
              </div>
            ) : event.type === 'image2' ? (
              /* ── 2페이지 복귀자 이미지 슬라이드 ── */
              <div key={event.id} className="slide-card slide-image-card">
                <img
                  src={returnBanner}
                  alt="복귀자 이벤트"
                  className="event-banner-img"
                />
              </div>
            ) : event.type === 'image3' ? (
              /* ── 3페이지 베스트리뷰자 이미지 슬라이드 ── */
              <div key={event.id} className="slide-card slide-image-card">
                <img
                  src={reviewBanner}
                  alt="베스트리뷰자 이벤트"
                  className="event-banner-img"
                />
              </div>
            ) : (
              /* ── 일반 카드 슬라이드 ── */
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
                  <button className="card-btn">혜택 받으러 가기</button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* 좌우 화살표 버튼 */}
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

      {/* 하단 점 인디케이터 */}
      <div className="dot-container">
        {events.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`dot ${currentIndex === idx ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* 쿠폰 받기 모달 */}
      {showCouponModal && (
        <div
          className="coupon-modal-overlay"
          onClick={() => setShowCouponModal(false)}
        >
          <div className="coupon-modal" onClick={(e) => e.stopPropagation()}>
            <div className="coupon-modal-header">
              <span className="coupon-modal-emoji">🎉</span>
              <h3 className="coupon-modal-title">신규회원 쿠폰</h3>
              <p className="coupon-modal-desc">
                회원가입을 축하드립니다!
                <br />
                아래 쿠폰을 발급받으세요.
              </p>
            </div>
            <div className="coupon-modal-card">
              <div className="coupon-modal-discount">20%</div>
              <div className="coupon-modal-label">신규회원 할인쿠폰</div>
              <div className="coupon-modal-code">WELCOME2024</div>
            </div>
            <button
              className="coupon-modal-btn"
              onClick={() => {
                alert('쿠폰이 발급되었습니다! 마이페이지에서 확인하세요.');
                setShowCouponModal(false);
              }}
            >
              쿠폰 발급받기
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
