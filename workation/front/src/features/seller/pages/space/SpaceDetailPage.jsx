import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Pencil, Plus, MapPin, Phone, Mail, Copy, Check, ChevronLeft, ChevronRight, X as XIcon } from 'lucide-react';
import { spaceApi } from '../../api/spaceApi';
import { stayApi } from '../../api/stayApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/common/Badge';
import StayCard from '../../components/stay/StayCard';
import EmptyState from '../../components/common/EmptyState';

const ACCENT = '#3ec9a7';
const TABS = ['스테이 목록', '리뷰'];

const CATEGORY_LABEL = {
  EXTERIOR: '외부/전경', ROOM: '객실', BATHROOM: '욕실',
  FACILITY: '공용시설', AMENITY: '부대시설', DINING: '식음료',
  OTHERS: '기타', OFFICE: '오피스',
};

export default function SpaceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [space, setSpace]           = useState(null);
  const [stays, setStays]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [staysLoading, setStaysLoading] = useState(false);
  const [error, setError]           = useState(null);
  const [activeTab, setActiveTab]   = useState(0);
  const [copied, setCopied]         = useState(false);
  const [lightbox, setLightbox]     = useState(null); // { pics, idx }

  const mapRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await spaceApi.getOne(id);
        setSpace(res.data);
        setStaysLoading(true);
        try {
          const stayRes = await stayApi.getList({ spaceId: id });
          setStays((stayRes.data ?? []).filter(s => String(s.spaceId) === String(id)));
        } finally {
          setStaysLoading(false);
        }
      } catch (e) {
        setError(e.response?.data?.message ?? '공간 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // 지도 렌더링 — loading=false 이후 MapDiv가 DOM에 마운트된 뒤 초기화
  useEffect(() => {
    if (loading || !space?.latitude || !space?.longitude) return;
    if (!window.kakao?.maps) return;

    const initMap = () => {
      if (!mapRef.current) return;
      const lat = Number(space.latitude);
      const lng = Number(space.longitude);
      const pos = new window.kakao.maps.LatLng(lat, lng);
      const map = new window.kakao.maps.Map(mapRef.current, { center: pos, level: 4 });
      const marker = new window.kakao.maps.Marker({ map, position: pos });
      const info = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:6px 10px;font-size:12px;font-weight:600;white-space:nowrap;">${space.name}</div>`,
      });
      info.open(map, marker);
      map.relayout();
    };

    if (window.kakao.maps.LatLng) {
      initMap();
    } else {
      window.kakao.maps.load(initMap);
    }
  }, [space, loading]);

  const handleCopy = () => {
    const addr = [space.address1, space.address2].filter(Boolean).join(' ');
    navigator.clipboard.writeText(addr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) return <LoadingSpinner centered />;
  if (error) {
    return (
      <Wrap>
        <ErrorState>
          <ErrorMsg>{error}</ErrorMsg>
          <RetryBtn onClick={() => window.location.reload()}>다시 시도</RetryBtn>
        </ErrorState>
      </Wrap>
    );
  }
  if (!space) return null;

  const fullAddress = [space.address1, space.address2].filter(Boolean).join(' ');
  const hasCoord = space.latitude != null && space.longitude != null;

  const isApproved = space.approvalStatus === 'APPROVED';

  return (
    <Wrap>
      {/* 승인 상태 배너 */}
      {space.approvalStatus === 'PENDING' && (
        <StatusBanner $type="pending">
          <span>⏳</span>
          <div>
            <BannerTitle>승인 요청을 보냈습니다 — 관리자 검토 대기 중</BannerTitle>
            <BannerSub>승인 완료 전까지 공간은 외부에 노출되지 않으며, 스테이 등록도 제한됩니다.</BannerSub>
          </div>
        </StatusBanner>
      )}
      {space.approvalStatus === 'REJECTED' && (
        <StatusBanner $type="rejected">
          <span>❌</span>
          <div>
            <BannerTitle>공간이 반려되었습니다</BannerTitle>
            <BannerSub>내용을 수정한 후 공간 수정 페이지에서 재승인을 요청하세요.</BannerSub>
          </div>
        </StatusBanner>
      )}

      {/* 페이지 헤더 */}
      <TopBar>
        <BackBtn type="button" onClick={() => navigate('/seller/spaces')}>
          <ArrowLeft size={18} />공간 목록
        </BackBtn>
        <ActionBtns>
          <EditBtn type="button" onClick={() => navigate(`/seller/spaces/${id}/edit`)}>
            <Pencil size={15} />공간 수정
          </EditBtn>
          <AddStayBtn
            type="button"
            onClick={() => isApproved && navigate('/seller/stays/register')}
            disabled={!isApproved}
            title={!isApproved ? '승인 후 스테이를 등록할 수 있습니다' : ''}
          >
            <Plus size={15} />스테이 등록
          </AddStayBtn>
        </ActionBtns>
      </TopBar>

      {/* 기본정보 */}
      <InfoCard>
        <InfoCardHeader>
          <SpaceThumbnail>
            {space.thumbnailUrl ? (
              <ThumbnailImg src={space.thumbnailUrl} alt={space.name} />
            ) : (
              <ThumbnailInitial>{space.name?.[0] ?? '?'}</ThumbnailInitial>
            )}
          </SpaceThumbnail>
          <HeaderInfo>
            <NameRow>
              <SpaceName>{space.name}</SpaceName>
              <Badge visibleYn={space.visibleYn} />
              {space.approvalStatus && (
                <ApprovalBadge $status={space.approvalStatus}>
                  {{ PENDING: '승인 대기중', APPROVED: '승인됨', REJECTED: '반려됨' }[space.approvalStatus]}
                </ApprovalBadge>
              )}
            </NameRow>
            {space.approvalStatus === 'REJECTED' && space.rejectionReason && (
              <RejectionNote>반려 사유: {space.rejectionReason}</RejectionNote>
            )}
            <AreaTag>
              <MapPin size={13} />
              {space.area ?? '-'}
            </AreaTag>
            {space.summary && <Summary>{space.summary}</Summary>}
          </HeaderInfo>
        </InfoCardHeader>

        <Divider />

        <MetaGrid>
          <MetaItem>
            <MetaLabel><Phone size={13} /> 전화번호</MetaLabel>
            <MetaValue>{space.phone ?? '-'}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel><Mail size={13} /> 이메일</MetaLabel>
            <MetaValue>{space.email ?? '-'}</MetaValue>
          </MetaItem>
          <MetaItem style={{ gridColumn: '1 / -1' }}>
            <MetaLabel><MapPin size={13} /> 주소</MetaLabel>
            <AddressRow>
              <MetaValue>{fullAddress || '-'}</MetaValue>
              {fullAddress && (
                <CopyBtn type="button" onClick={handleCopy} title="주소 복사">
                  {copied ? <Check size={14} color={ACCENT} /> : <Copy size={14} />}
                </CopyBtn>
              )}
            </AddressRow>
          </MetaItem>
        </MetaGrid>

        {/* 지도 */}
        {hasCoord ? (
          <MapSection>
            <MapDiv ref={mapRef} />
          </MapSection>
        ) : (
          <NoMapNote>등록된 위치 정보가 없습니다.</NoMapNote>
        )}

        {space.description && (
          <DescSection>
            <DescLabel>상세 설명</DescLabel>
            <DescText>{space.description}</DescText>
          </DescSection>
        )}
      </InfoCard>

      {/* 사진 섹션 */}
      <PhotoCard>
        <SectionTitle>공간 사진</SectionTitle>
        {space.pictures && space.pictures.length > 0 ? (
          <PhotoGrid>
            {space.pictures.map((pic, idx) => (
              <PhotoItem
                key={pic.id}
                $isMain={pic.mainYn === 'Y'}
                onClick={() => setLightbox({ pics: space.pictures, idx })}
              >
                <PhotoImg src={pic.filePath} alt={space.name} />
                {pic.mainYn === 'Y' && <MainBadge>대표</MainBadge>}
                {pic.category && (
                  <CategoryBadge>{CATEGORY_LABEL[pic.category] ?? pic.category}</CategoryBadge>
                )}
              </PhotoItem>
            ))}
          </PhotoGrid>
        ) : (
          <PhotoNote>등록된 사진이 없습니다.</PhotoNote>
        )}
      </PhotoCard>

      {/* 탭 섹션 */}
      <TabCard>
        <TabBar>
          {TABS.map((tab, idx) => (
            <Tab key={tab} $active={activeTab === idx} onClick={() => setActiveTab(idx)}>
              {tab}
              {idx === 0 && stays.length > 0 && <TabCount>{stays.length}</TabCount>}
            </Tab>
          ))}
        </TabBar>

        <TabContent>
          {activeTab === 0 && (
            staysLoading ? (
              <LoadingSpinner centered />
            ) : stays.length === 0 ? (
              <EmptyState
                title="등록된 스테이가 없습니다"
                description="이 공간에 스테이(객실)를 등록해보세요."
                actionLabel="스테이 등록"
                onAction={() => navigate('/seller/stays/register')}
              />
            ) : (
              <StayGrid>
                {stays.map((stay) => (
                  <div key={stay.id} onClick={() => navigate(`/seller/stays/${stay.id}`)} style={{ cursor: 'pointer' }}>
                    <StayCard stay={stay} />
                  </div>
                ))}
              </StayGrid>
            )
          )}
          {activeTab === 1 && (
            <EmptyState title="리뷰 서비스 준비 중입니다" description="현재 리뷰 API가 구현 중입니다." />
          )}
        </TabContent>
      </TabCard>
      {/* 라이트박스 */}
      {lightbox && (
        <LbOverlay onClick={() => setLightbox(null)}>
          <LbBox onClick={(e) => e.stopPropagation()}>
            <LbCloseBtn onClick={() => setLightbox(null)}><XIcon size={20} /></LbCloseBtn>

            <LbImg src={lightbox.pics[lightbox.idx].filePath} alt="" />

            {lightbox.pics.length > 1 && (
              <>
                <LbPrev
                  onClick={() => setLightbox((lb) => ({ ...lb, idx: (lb.idx - 1 + lb.pics.length) % lb.pics.length }))}
                >
                  <ChevronLeft size={24} />
                </LbPrev>
                <LbNext
                  onClick={() => setLightbox((lb) => ({ ...lb, idx: (lb.idx + 1) % lb.pics.length }))}
                >
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

/* ── Styled ── */

const Wrap = styled.div`display: flex; flex-direction: column; gap: 24px;`;

const TopBar = styled.div`display: flex; align-items: center; justify-content: space-between;`;

const BackBtn = styled.button`
  display: flex; align-items: center; gap: 6px;
  font-size: 14px; font-weight: 500; color: ${({ theme }) => theme.colors.textMuted};
  font-family: inherit; cursor: pointer; transition: color 0.15s;
  &:hover { color: ${({ theme }) => theme.colors.adminTextDark}; }
`;

const ActionBtns = styled.div`display: flex; align-items: center; gap: 8px;`;

const EditBtn = styled.button`
  display: flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMid}; background: white;
  font-family: inherit; cursor: pointer; transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.bgSection}; }
`;

const AddStayBtn = styled.button`
  display: flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 600;
  color: white;
  background: ${({ disabled }) => (disabled ? '#94a3b8' : ACCENT)};
  font-family: inherit;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.15s;
  &:hover:not(:disabled) { background: #31b08e; }
`;

const StatusBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 20px;
  border-radius: 10px;
  background: ${({ $type }) => $type === 'pending' ? '#fef9ec' : '#fff1f1'};
  border: 1px solid ${({ $type }) => $type === 'pending' ? '#fcd34d' : '#fca5a5'};
  font-size: 20px;
`;

const BannerTitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  margin-bottom: 2px;
`;

const BannerSub = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const InfoCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px; box-shadow: ${({ theme }) => theme.shadows.card}; overflow: hidden;
`;

const InfoCardHeader = styled.div`display: flex; gap: 24px; padding: 24px;`;

const SpaceThumbnail = styled.div`
  width: 100px; height: 100px; border-radius: 10px;
  background: #1c3442; overflow: hidden; flex-shrink: 0;
`;

const ThumbnailImg = styled.img`width: 100%; height: 100%; object-fit: cover;`;

const ThumbnailInitial = styled.div`
  width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
  font-size: 32px; font-weight: 700; color: rgba(255,255,255,0.8);
`;

const HeaderInfo = styled.div`flex: 1; display: flex; flex-direction: column; gap: 8px;`;

const NameRow = styled.div`display: flex; align-items: center; gap: 10px;`;

const SpaceName = styled.h1`
  font-size: 22px; font-weight: 700; color: ${({ theme }) => theme.colors.adminTextDark};
`;

const AreaTag = styled.span`
  display: flex; align-items: center; gap: 4px;
  font-size: 13px; color: ${({ theme }) => theme.colors.textMuted};
`;

const Summary = styled.p`font-size: 14px; color: ${({ theme }) => theme.colors.textMid}; line-height: 1.5;`;

const Divider = styled.div`height: 1px; background: ${({ theme }) => theme.colors.borderLight}; margin: 0 24px;`;

const MetaGrid = styled.div`
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 24px;
`;

const MetaItem = styled.div`display: flex; flex-direction: column; gap: 4px;`;

const MetaLabel = styled.span`
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; color: ${({ theme }) => theme.colors.textMuted}; font-weight: 500;
`;

const MetaValue = styled.span`
  font-size: 14px; color: ${({ theme }) => theme.colors.adminTextDark}; font-weight: 500;
`;

const AddressRow = styled.div`display: flex; align-items: center; gap: 8px;`;

const CopyBtn = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 6px; flex-shrink: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white; color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer; transition: all 0.15s;
  &:hover { border-color: ${ACCENT}; color: ${ACCENT}; background: ${ACCENT}10; }
`;

const MapSection = styled.div`
  margin: 0 24px 24px;
  border-radius: 10px; overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const MapDiv = styled.div`width: 100%; height: 260px;`;

const NoMapNote = styled.p`
  margin: 0 24px 24px;
  font-size: 13px; color: ${({ theme }) => theme.colors.textMuted};
  padding: 12px 16px; background: ${({ theme }) => theme.colors.bgSection};
  border-radius: 8px; border: 1px dashed ${({ theme }) => theme.colors.border};
`;

const DescSection = styled.div`
  padding: 0 24px 24px; display: flex; flex-direction: column; gap: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight}; padding-top: 20px;
`;

const DescLabel = styled.p`font-size: 13px; font-weight: 600; color: ${({ theme }) => theme.colors.textMid};`;

const DescText = styled.p`
  font-size: 14px; color: ${({ theme }) => theme.colors.adminTextDark};
  line-height: 1.7; white-space: pre-line;
`;

const PhotoCard = styled.div`
  background: white; border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px; padding: 24px; box-shadow: ${({ theme }) => theme.shadows.card};
`;

const SectionTitle = styled.h2`
  font-size: 16px; font-weight: 700; color: ${({ theme }) => theme.colors.adminTextDark}; margin-bottom: 12px;
`;

const PhotoNote = styled.p`
  font-size: 13px; color: ${({ theme }) => theme.colors.textMuted};
  padding: 16px; background: ${({ theme }) => theme.colors.bgSection};
  border-radius: 8px; border: 1px dashed ${({ theme }) => theme.colors.border};
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
`;

const PhotoItem = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${({ $isMain }) => ($isMain ? ACCENT : 'transparent')};
  aspect-ratio: 4/3;
  background: ${({ theme }) => theme.colors.bgSection};
`;

const PhotoImg = styled.img`
  width: 100%; height: 100%; object-fit: cover;
`;

const STATUS_COLOR = {
  PENDING:  { bg: '#fef3c7', color: '#92400e' },
  APPROVED: { bg: '#d1fae5', color: '#065f46' },
  REJECTED: { bg: '#fee2e2', color: '#991b1b' },
};

const ApprovalBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  background: ${({ $status }) => STATUS_COLOR[$status]?.bg ?? '#f1f5f9'};
  color: ${({ $status }) => STATUS_COLOR[$status]?.color ?? '#475569'};
`;

const RejectionNote = styled.p`
  font-size: 12px;
  color: #991b1b;
  background: #fee2e2;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #fca5a5;
  margin-top: 4px;
`;

const MainBadge = styled.span`
  position: absolute; top: 6px; left: 6px;
  background: ${ACCENT}; color: white;
  font-size: 11px; font-weight: 700;
  padding: 2px 7px; border-radius: 4px;
`;

const CategoryBadge = styled.span`
  position: absolute; bottom: 6px; left: 6px;
  background: rgba(0,0,0,0.55); color: white;
  font-size: 11px; font-weight: 500;
  padding: 2px 7px; border-radius: 4px;
  backdrop-filter: blur(2px);
`;

/* 라이트박스 */
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
  cursor: pointer; transition: background 0.15s;
  &:hover { background: rgba(255,255,255,0.3); }
`;

const LbPrev = styled.button`
  position: absolute; left: -52px; top: 50%; transform: translateY(-50%);
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.15); color: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.15s;
  &:hover { background: rgba(255,255,255,0.3); }
`;

const LbNext = styled.button`
  position: absolute; right: -52px; top: 50%; transform: translateY(-50%);
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.15); color: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.15s;
  &:hover { background: rgba(255,255,255,0.3); }
`;

const LbCounter = styled.div`
  position: absolute; bottom: -36px; left: 50%; transform: translateX(-50%);
  color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 500;
  white-space: nowrap;
`;

const TabCard = styled.div`
  background: white; border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px; box-shadow: ${({ theme }) => theme.shadows.card}; overflow: hidden;
`;

const TabBar = styled.div`display: flex; border-bottom: 1px solid ${({ theme }) => theme.colors.border};`;

const Tab = styled.button`
  display: flex; align-items: center; gap: 6px;
  padding: 14px 24px; font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '700' : '500')};
  color: ${({ $active }) => ($active ? '#0d9488' : '#64748b')};
  border-bottom: 2px solid ${({ $active }) => ($active ? ACCENT : 'transparent')};
  background: none; font-family: inherit; cursor: pointer; transition: color 0.15s;
  &:hover { color: #0d9488; }
`;

const TabCount = styled.span`
  background: ${ACCENT}; color: white; font-size: 11px; font-weight: 700;
  padding: 1px 6px; border-radius: 999px;
`;

const TabContent = styled.div`padding: 24px;`;

const StayGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px;
`;

const ErrorState = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 80px 24px;
`;

const ErrorMsg = styled.p`font-size: 14px; color: #b91c1c;`;

const RetryBtn = styled.button`
  padding: 8px 20px; border-radius: 8px; font-size: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border}; background: white;
  cursor: pointer; font-family: inherit;
`;
