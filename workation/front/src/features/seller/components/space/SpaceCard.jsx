import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function SpaceCard({ space, areaLabel, onDelete }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardShadow />

      {/* 이미지 영역 */}
      <ImageArea>
        <PlaceholderBg />
        <BuildingIconWrap>
          <BuildingIcon />
        </BuildingIconWrap>
        <BadgeRow>
          <AreaBadge>{areaLabel}</AreaBadge>
          <VisibleBadge $visible={space.visibleYn === 'Y'}>
            {space.visibleYn === 'Y' ? '노출중' : '비노출'}
          </VisibleBadge>
        </BadgeRow>
      </ImageArea>

      {/* 본문 */}
      <CardBody>
        <SpaceName>{space.name}</SpaceName>
        {space.summary && <SpaceSummary>{space.summary}</SpaceSummary>}

        <MetaList>
          <MetaItem>
            <MetaIcon><LocationIcon /></MetaIcon>
            <MetaText>{space.address1}{space.address2 ? ` ${space.address2}` : ''}</MetaText>
          </MetaItem>
          {space.phone && (
            <MetaItem>
              <MetaIcon><PhoneIcon /></MetaIcon>
              <MetaText>{space.phone}</MetaText>
            </MetaItem>
          )}
          {space.email && (
            <MetaItem>
              <MetaIcon><EmailIcon /></MetaIcon>
              <MetaText>{space.email}</MetaText>
            </MetaItem>
          )}
        </MetaList>
      </CardBody>

      {/* 하단 액션 */}
      <CardFooter>
        <UnitBtnGroup>
          <UnitBtn onClick={() => navigate(`/seller/spaces/${space.id}/stays`)}>
            숙소 관리
          </UnitBtn>
          <UnitBtn onClick={() => navigate(`/seller/spaces/${space.id}/offices`)}>
            오피스 관리
          </UnitBtn>
        </UnitBtnGroup>
        <ActionBtnGroup>
          <EditBtn onClick={() => navigate(`/seller/spaces/${space.id}/edit`)}>
            수정
          </EditBtn>
          <DeleteBtn onClick={onDelete}>삭제</DeleteBtn>
        </ActionBtnGroup>
      </CardFooter>
    </Card>
  );
}

/* ── SVG Icons ── */

function BuildingIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3d646c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 22V12h6v10M3 9h18" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 13 19.79 19.79 0 0 1 1 4.18 2 2 0 0 1 2.96 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

/* ── Styled Components ── */

const Card = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const CardShadow = styled.div`
  position: absolute;
  inset: -1px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.06);
  pointer-events: none;
  z-index: 0;
`;

const ImageArea = styled.div`
  position: relative;
  height: 140px;
  overflow: hidden;
  flex-shrink: 0;
`;

const PlaceholderBg = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #c3edf6 0%, #f6e5ba 100%);
`;

const BuildingIconWrap = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
`;

const BadgeRow = styled.div`
  position: absolute;
  bottom: 10px;
  left: 12px;
  display: flex;
  gap: 6px;
`;

const AreaBadge = styled.span`
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  background: rgba(255, 255, 255, 0.9);
  color: #2c6480;
`;

const VisibleBadge = styled.span`
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  background: ${({ $visible }) => ($visible ? '#dcfce7' : '#fee2e2')};
  color: ${({ $visible }) => ($visible ? '#15803d' : '#dc2626')};
`;

const CardBody = styled.div`
  padding: 20px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  position: relative;
  z-index: 1;
`;

const SpaceName = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #191c1e;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SpaceSummary = styled.p`
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 4px;
  list-style: none;
`;

const MetaItem = styled.li`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const MetaIcon = styled.span`
  color: #94a3b8;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const MetaText = styled.span`
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardFooter = styled.div`
  padding: 12px 20px 16px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  position: relative;
  z-index: 1;
`;

const UnitBtnGroup = styled.div`
  display: flex;
  gap: 6px;
`;

const UnitBtn = styled.button`
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #3d646c;
  background: #e0f5f8;
  transition: background 0.15s;

  &:hover {
    background: #c3edf6;
  }
`;

const ActionBtnGroup = styled.div`
  display: flex;
  gap: 6px;
`;

const EditBtn = styled.button`
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #3d646c;
  border: 1px solid #c3edf6;
  background: white;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: #f0fdf4;
    border-color: #3d646c;
  }
`;

const DeleteBtn = styled.button`
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #dc2626;
  border: 1px solid #fecaca;
  background: white;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: #fef2f2;
    border-color: #dc2626;
  }
`;
