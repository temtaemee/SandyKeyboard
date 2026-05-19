import React, { useState } from 'react';
import './EventPage.css'; // 같은 폴더에 있는 CSS 파일을 불러옵니다.

const EventPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const events = [
    {
      id: 1,
      title: '신규 쿠폰 이벤트',
      subTitle: 'Welcome to OUR SHOP!',
      discount: '10,000원',
      desc: '지금 가입하시면 즉시 사용 가능한 가입 축하 쿠폰을 드립니다.',
      bgClass: 'bg-blue',
      tag: 'NEW',
    },
    {
      id: 2,
      title: '웰컴 쿠폰 팩',
      subTitle: '첫 구매 고객을 위한 특별한 혜택',
      discount: '최대 15% 추가 할인',
      desc: '첫 구매 확정 시, 다음 구매에 쓸 수 있는 웰컴 쿠폰팩이 자동으로 지급됩니다.',
      bgClass: 'bg-purple',
      tag: 'WELCOME',
    },
    {
      id: 3,
      title: '베스트 리뷰 이벤트',
      subTitle: '소중한 후기를 남겨주세요',
      discount: '네이버페이 5,000P',
      desc: '포토 리뷰어 중 매달 10분을 선정하여 쇼핑 지원금을 선물합니다.',
      bgClass: 'bg-green',
      tag: 'REVIEW',
    },
    {
      id: 4,
      title: '지인 초대 이벤트',
      subTitle: '친구도 나도 함께 받는 혜택',
      discount: '둘 다 5,000원 적립',
      desc: '초대 링크를 통해 친구가 가입하면 두 분 모두에게 즉시 적립금을 드립니다.',
      bgClass: 'bg-orange',
      tag: 'INVITE',
    },
  ];

  const nextSlide = () => {
    if (currentIndex < events.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
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
          {events.map((event) => (
            <div key={event.id} className={`slide-card ${event.bgClass}`}>
              {/* 상단 태그 및 제목 */}
              <div className="card-top">
                <span className="card-tag">{event.tag}</span>
                <p className="card-subtitle">{event.subTitle}</p>
                <h3 className="card-main-title">{event.title}</h3>
              </div>

              {/* 중앙 쿠폰 혜택 */}
              <div className="card-coupon">
                <span className="coupon-discount">{event.discount}</span>
                <span className="coupon-sub">COUPON BENEFIT</span>
              </div>

              {/* 하단 설명 및 버튼 */}
              <div className="card-bottom">
                <p className="card-desc">{event.desc}</p>
                <button className="card-btn">혜택 받으러 가기</button>
              </div>
            </div>
          ))}
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

      {/* 하단 점(도트) 인디케이터 */}
      <div className="dot-container">
        {events.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`dot ${currentIndex === idx ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default EventPage;
