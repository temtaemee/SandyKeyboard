import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Pencil, ChevronLeft, ChevronRight, X as XIcon } from 'lucide-react';
import { stayApi } from '../../api/stayApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import PriceWeekGrid from '../../components/stay/PriceWeekGrid';
import OptionSelector from '../../components/stay/OptionSelector';
import { resolveSellerImageUrl } from '../../utils/imageUrl';

const ACCENT = '#3ec9a7';

const formatTime = (t) => {
  if (!t) return '-';
  return t.slice(0, 5); // "HH:mm:ss" → "HH:mm"
};

export default function StayDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stay, setStay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await stayApi.getOne(id);
        setStay(res.data);
      } catch (e) {
        setError(e.response?.data?.message ?? '스테이 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <LoadingSpinner centered />;

  if (error) {
    return (
      <Wrap>
        <ErrorMsg>{error}</ErrorMsg>
        <RetryBtn onClick={() => window.location.reload()}>다시 시도</RetryBtn>
      </Wrap>
    );
  }

  if (!stay) return null;

  const thumbnail = stay.pictures?.find((p) => p.mainYn === 'Y')?.filePath
    ?? stay.pictures?.[0]?.filePath;
  const thumbnailUrl = resolveSellerImageUrl(thumbnail);

  return (
    <Wrap>
      {/* 헤더 */}
      <TopBar>
        <BackBtn type="button" onClick={() => navigate('/seller/stays')}>
          <ArrowLeft size={18} />
          스테이 목록
        </BackBtn>
        <EditBtn type="button" onClick={() => navigate(`/seller/stays/${id}/edit`)}>
          <Pencil size={15} />
          스테이 수정
        </EditBtn>
      </TopBar>

      {/* 기본정보 */}
      <InfoCard>
        <CardHeader>
          {thumbnailUrl ? (
            <ThumbnailImg src={thumbnailUrl} alt={stay.name} />
          ) : (
            <ThumbnailInitial>{stay.name?.[0] ?? '?'}</ThumbnailInitial>
          )}
          <HeaderInfo>
            <NameRow>
              <StayName>{stay.name}</StayName>
              <Badges>
                <Badge visibleYn={stay.visibleYn} />
                {stay.workationYn === 'Y' && <WorkBadge>워케이션</WorkBadge>}
              </Badges>
            </NameRow>
            {stay.summary && <Summary>{stay.summary}</Summary>}
            <SpaceRef>공간 #{stay.spaceId}</SpaceRef>
          </HeaderInfo>
        </CardHeader>

        {stay.description && (
          <>
            <Divider />
            <DescSection>
              <SectionLabel>상세 설명</SectionLabel>
              <DescText>{stay.description}</DescText>
            </DescSection>
          </>
        )}
      </InfoCard>

      {/* 인원 & 시간 */}
      <MetaCard>
        <MetaRow>
          <MetaItem>
            <MetaLabel>기본 인원</MetaLabel>
            <MetaValue>{stay.capacity ?? '-'}명</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>최대 인원</MetaLabel>
            <MetaValue>{stay.maxCapa ?? '-'}명</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>체크인</MetaLabel>
            <MetaValue>{formatTime(stay.checkInTime)}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>체크아웃</MetaLabel>
            <MetaValue>{formatTime(stay.checkOutTime)}</MetaValue>
          </MetaItem>
        </MetaRow>
      </MetaCard>

      {/* 요일별 단가 */}
      <DetailCard>
        <SectionTitle>요일별 단가</SectionTitle>
        <PriceWeekGrid
          prices={{
            monPrice: stay.monPrice,
            tuePrice: stay.tuePrice,
            wedPrice: stay.wedPrice,
            thuPrice: stay.thuPrice,
            friPrice: stay.friPrice,
            satPrice: stay.satPrice,
            sunPrice: stay.sunPrice,
            holidayPrice: stay.holidayPrice,
          }}
          readOnly
        />
      </DetailCard>

      {/* 옵션 */}
      <DetailCard>
        <SectionTitle>편의 옵션</SectionTitle>
        <OptionSelector
          selected={stay.options ?? []}
          readOnly
        />
      </DetailCard>

      {/* 사진 갤러리 */}
      {stay.pictures?.length > 0 && (
        <DetailCard>
          <SectionTitle>사진</SectionTitle>
          <PictureGrid>
            {stay.pictures.map((pic, idx) => (
              <PictureItem key={pic.id} onClick={() => setLightbox({ pics: stay.pictures, idx })}>
                <PictureImg src={resolveSellerImageUrl(pic.filePath)} alt={`사진 ${idx + 1}`} />
                {pic.mainYn === 'Y' && <MainTag>대표</MainTag>}
              </PictureItem>
            ))}
          </PictureGrid>
        </DetailCard>
      )}

      {lightbox && (
        <LbOverlay onClick={() => setLightbox(null)}>
          <LbBox onClick={(e) => e.stopPropagation()}>
            <LbCloseBtn onClick={() => setLightbox(null)}><XIcon size={20} /></LbCloseBtn>
            <LbImg src={resolveSellerImageUrl(lightbox.pics[lightbox.idx].filePath)} alt="" />
            {lightbox.pics.length > 1 && (
              <>
                <LbPrev onClick={() => setLightbox((lb) => ({ ...lb, idx: (lb.idx - 1 + lb.pics.length) % lb.pics.length }))}>
                  <ChevronLeft size={24} />
                </LbPrev>
                <LbNext onClick={() => setLightbox((lb) => ({ ...lb, idx: (lb.idx + 1) % lb.pics.length }))}>
                  <ChevronRight size={24} />
                </LbNext>
                <LbCounter>{lightbox.idx + 1} / {lightbox.pics.length}</LbCounter>
              </>
            )}
          </LbBox>
        </LbOverlay>
      )}
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: inherit;
  cursor: pointer;
  transition: color 0.15s;
  &:hover { color: ${({ theme }) => theme.colors.adminTextDark}; }
`;

const EditBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: ${ACCENT};
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #31b08e; }
`;

const InfoCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  gap: 20px;
  padding: 24px;
`;

const ThumbnailImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
`;

const ThumbnailInitial = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  background: #1c3442;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  flex-shrink: 0;
`;

const HeaderInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const StayName = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const Badges = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
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
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMid};
  line-height: 1.5;
`;

const SpaceRef = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.borderLight};
  margin: 0 24px;
`;

const DescSection = styled.div`
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMid};
`;

const DescText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  line-height: 1.7;
  white-space: pre-line;
`;

const MetaCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const MetaRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.bgSection};
`;

const MetaLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
`;

const MetaValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
`;

const DetailCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  padding: 24px;
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const PictureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
`;

const PictureItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  &:hover { opacity: 0.85; }
  transition: opacity 0.15s;
`;

const PictureImg = styled.img`
  width: 100%;
  height: 110px;
  object-fit: cover;
  display: block;
`;

const MainTag = styled.div`
  position: absolute;
  top: 4px;
  left: 4px;
  background: ${ACCENT};
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
`;

const ErrorMsg = styled.p`
  font-size: 14px;
  color: #b91c1c;
  text-align: center;
  padding: 48px;
`;

const RetryBtn = styled.button`
  margin: 0 auto;
  display: block;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  cursor: pointer;
  font-family: inherit;
`;

const LbOverlay = styled.div`
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(0,0,0,0.85);
  display: flex; align-items: center; justify-content: center;
`;
const LbBox = styled.div`
  position: relative;
  max-width: 90vw; max-height: 90vh;
  display: flex; align-items: center; justify-content: center;
`;
const LbImg = styled.img`
  max-width: 90vw; max-height: 85vh;
  object-fit: contain; border-radius: 8px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
`;
const LbCloseBtn = styled.button`
  position: absolute; top: -44px; right: 0;
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,0.15); color: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  &:hover { background: rgba(255,255,255,0.3); }
`;
const LbPrev = styled.button`
  position: absolute; left: -52px; top: 50%; transform: translateY(-50%);
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.15); color: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  &:hover { background: rgba(255,255,255,0.3); }
`;
const LbNext = styled.button`
  position: absolute; right: -52px; top: 50%; transform: translateY(-50%);
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.15); color: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  &:hover { background: rgba(255,255,255,0.3); }
`;
const LbCounter = styled.div`
  position: absolute; bottom: -36px; left: 50%; transform: translateX(-50%);
  color: rgba(255,255,255,0.7); font-size: 13px; white-space: nowrap;
`;
