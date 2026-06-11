import styled from 'styled-components';
import Badge from '../common/Badge';
import { OPTION_LABELS } from './OptionSelector';
import { resolveSellerImageUrl } from '../../utils/imageUrl';

/**
 * 스테이 카드 (상세에서 사용)
 * @param {object} stay StayResDto
 */
export default function StayCard({ stay }) {
  if (!stay) return null;

  const thumbnail = stay.pictures?.find((p) => p.mainYn === 'Y')?.filePath
    ?? stay.pictures?.[0]?.filePath;
  const thumbnailUrl = resolveSellerImageUrl(thumbnail);

  const formatTime = (t) => {
    if (!t) return '-';
    return t.slice(0, 5); // "HH:mm:ss" → "HH:mm"
  };

  const weekdayAvg = (() => {
    const prices = [
      stay.monPrice, stay.tuePrice, stay.wedPrice,
      stay.thuPrice, stay.friPrice,
    ].filter((p) => p != null && p > 0);
    if (!prices.length) return null;
    return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  })();

  return (
    <Card>
      <Thumbnail>
        {thumbnailUrl ? (
          <ThumbnailImg src={thumbnailUrl} alt={stay.name} />
        ) : (
          <ThumbnailInitial>{stay.name?.[0] ?? '?'}</ThumbnailInitial>
        )}
      </Thumbnail>

      <Body>
        <TopRow>
          <StayName>{stay.name}</StayName>
          <BadgeRow>
            <Badge visibleYn={stay.visibleYn} />
            {stay.workationYn === 'Y' && <WorkBadge>워케이션</WorkBadge>}
          </BadgeRow>
        </TopRow>

        {stay.summary && <Summary>{stay.summary}</Summary>}

        <MetaGrid>
          <MetaItem>
            <MetaLabel>기본/최대 인원</MetaLabel>
            <MetaValue>{stay.capacity ?? '-'} / {stay.maxCapa ?? '-'}명</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>체크인</MetaLabel>
            <MetaValue>{formatTime(stay.checkInTime)}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>체크아웃</MetaLabel>
            <MetaValue>{formatTime(stay.checkOutTime)}</MetaValue>
          </MetaItem>
          {weekdayAvg != null && (
            <MetaItem>
              <MetaLabel>평일 평균 단가</MetaLabel>
              <MetaValue>{weekdayAvg.toLocaleString()}원</MetaValue>
            </MetaItem>
          )}
        </MetaGrid>

        {stay.options?.length > 0 && (
          <OptionsRow>
            {stay.options.slice(0, 5).map((opt) => (
              <OptionTag key={opt}>{OPTION_LABELS[opt] ?? opt}</OptionTag>
            ))}
            {stay.options.length > 5 && (
              <OptionTag>+{stay.options.length - 5}</OptionTag>
            )}
          </OptionsRow>
        )}
      </Body>
    </Card>
  );
}

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 160px;
  background: #1c3442;
  overflow: hidden;
`;

const ThumbnailImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ThumbnailInitial = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
`;

const Body = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const StayName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

const WorkBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(62, 201, 167, 0.12);
  color: #0d9488;
`;

const Summary = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MetaLabel = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
`;

const MetaValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const OptionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const OptionTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  background: #f1f5f9;
  color: #475569;
`;
