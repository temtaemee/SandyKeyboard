import { useState } from "react";
import styled from "styled-components";

export default function SpaceCard({ space }) {
  const [wished, setWished] = useState(false);

  return (
    <Card>
      <ImgWrap>
        <CardImg src={space.image} alt={space.title} />
        <LocationBadge>{space.location}</LocationBadge>
      </ImgWrap>

      <CardBody>
        <CardTitle>{space.title}</CardTitle>
        <TagRow>
          {space.tags.map((tag) => (
            <Tag key={tag.label} $type={tag.type}>
              {tag.label}
            </Tag>
          ))}
        </TagRow>
        <CardFooter>
          <PriceBox>
            <PriceAmount>{space.price}</PriceAmount>
            <PriceUnit>/ 1박</PriceUnit>
          </PriceBox>
          <WishBtn
            onClick={() => setWished((prev) => !prev)}
            $wished={wished}
            aria-label="찜하기"
          >
            <HeartIcon filled={wished} />
          </WishBtn>
        </CardFooter>
      </CardBody>
    </Card>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg
      width="20"
      height="19"
      viewBox="0 0 24 24"
      fill={filled ? "#f9a825" : "none"}
      stroke={filled ? "#f9a825" : "#f9e2af"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ── Styled Components ── */

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
  blue: { bg: "#c3edf6", color: "#456d74" },
  yellow: { bg: "#f6e5ba", color: "#726643" },
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
