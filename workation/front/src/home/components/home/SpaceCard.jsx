import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // 💡 1. useNavigate import

export default function SpaceCard({ space }) {
  const [wished, setWished] = useState(false);
  const navigate = useNavigate(); // 💡 2. 훅을 컴포넌트 최상단에서 호출

  const title = space?.name || '이름 없음';
  const location = space?.area || '지역 미정';
  const summary = space?.summary || '';
  const rating = space?.averageRating || 0.0;

  // 💡 3. 함수 안에서는 navigate()를 사용
  const handleCardClick = () => {
    navigate(`/resv/space/${space.id}`);
  };

  return (
    <Card onClick={handleCardClick}>
      {/* ... 나머지 코드 동일 */}
      <ImgWrap>
        <CardImg
          src={space?.thumbnailUrl || '/default-image.jpg'}
          alt={title}
        />
        <LocationBadge>{location}</LocationBadge>
      </ImgWrap>
      <CardBody>
        <CardTitle>{title}</CardTitle>
        <RatingRow>★ {rating.toFixed(1)}</RatingRow>
        <CardSummary>{summary}</CardSummary>
        <CardFooter>
          <WishBtn
            // 💡 4. WishBtn 클릭 시 페이지 이동이 발생하지 않도록 stopPropagation 추가
            onClick={(e) => {
              e.stopPropagation();
              setWished((prev) => !prev);
            }}
            aria-label="찜하기"
          >
            <HeartIcon filled={wished} />
          </WishBtn>
        </CardFooter>
      </CardBody>
    </Card>
  );
}

/* ── Styled Components ── */
function HeartIcon({ filled }) {
  return (
    <svg
      width="20"
      height="19"
      viewBox="0 0 24 24"
      fill={filled ? '#f9a825' : 'none'}
      stroke={filled ? '#f9a825' : '#f9e2af'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

const Card = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;

const ImgWrap = styled.div`
  height: 256px;
  position: relative;
  overflow: hidden;
`;

const CardImg = styled.img`
  width: 100%;
  height: 149%;
  object-fit: cover;
  position: absolute;
  top: -24.61%;
  left: 0;
  transition: transform 0.4s;

  ${Card}:hover & {
    transform: scale(1.04);
  }
`;

const LocationBadge = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`;

const CardBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardTitle = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textDark};
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
  padding-bottom: 8px;
  flex-wrap: wrap;
`;

const TAG_COLORS = {
  blue: { bg: '#c3edf6', color: '#456d74' },
  yellow: { bg: '#f6e5ba', color: '#726643' },
};

const Tag = styled.span`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${({ $type }) => TAG_COLORS[$type]?.bg};
  color: ${({ $type }) => TAG_COLORS[$type]?.color};
`;

const CardFooter = styled.div`
  border-top: 1px solid #f8fafc;
  padding-top: 17px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PriceBox = styled.div`
  display: flex;
  align-items: baseline;
  gap: 3px;
`;

const PriceAmount = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const PriceUnit = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textLight};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const WishBtn = styled.button`
  padding: 4px;
  line-height: 0;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;
const RatingRow = styled.div`
  font-size: 14px;
  color: #f9a825;
  font-weight: 600;
  margin-bottom: 4px;
`;
const CardSummary = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 2줄까지만 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
