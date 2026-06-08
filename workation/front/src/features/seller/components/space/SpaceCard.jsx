import styled from 'styled-components';
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import ToggleSwitch from '../common/ToggleSwitch';

const AREA_LABEL = {
  SEOUL: '서울', GYEONGGI: '경기', GANGWON: '강원',
  CHUNGNAM: '충남', CHUNGBUK: '충북', GYEONGNAM: '경남',
  GYEONGBUK: '경북', JEONNAM: '전남', JEONBUK: '전북', JEJU: '제주',
};

/**
 * 공간 카드
 * @param {object} space SpaceResDto
 * @param {function} onVisibleToggle (id, visibleYn) => void
 * @param {function} onDetail (id) => void
 * @param {function} onEdit (id) => void
 * @param {function} onDelete (id) => void
 * @param {boolean} toggling
 */
export default function SpaceCard({ space, onVisibleToggle, onDetail, onEdit, onDelete, toggling }) {
  const areaLabel = AREA_LABEL[space.area] ?? space.area ?? '-';
  const isVisible = space.visibleYn === 'Y';

  return (
    <Card>
      <Thumbnail onClick={() => onDetail?.(space.id)}>
        {space.thumbnailUrl ? (
          <ThumbnailImg src={space.thumbnailUrl} alt={space.name} />
        ) : (
          <ThumbnailInitial>{space.name?.[0] ?? '?'}</ThumbnailInitial>
        )}
      </Thumbnail>

      <Body>
        <TopRow>
          <SpaceName onClick={() => onDetail?.(space.id)}>{space.name}</SpaceName>
          <Badge visibleYn={space.visibleYn} />
        </TopRow>
        <AreaLabel>{areaLabel}</AreaLabel>

        <Actions>
          <ToggleSwitch
            checked={isVisible}
            loading={toggling}
            onChange={(next) => onVisibleToggle?.(space.id, next ? 'Y' : 'N')}
          />
          <ActionBtn title="상세" onClick={() => onDetail?.(space.id)}>
            <Eye size={15} />
          </ActionBtn>
          <ActionBtn title="수정" onClick={() => onEdit?.(space.id)}>
            <Pencil size={15} />
          </ActionBtn>
          <DeleteBtn title="삭제" onClick={() => onDelete?.(space.id)}>
            <Trash2 size={15} />
          </DeleteBtn>
        </Actions>
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
  transition: transform 0.15s, box-shadow 0.15s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.cardHover};
  }
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 140px;
  background: #1c3442;
  cursor: pointer;
  overflow: hidden;
  position: relative;
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
  font-size: 36px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
`;

const Body = styled.div`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const SpaceName = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
  cursor: pointer;
  line-height: 1.4;
  flex: 1;
  &:hover {
    color: #3ec9a7;
  }
`;

const AreaLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
    color: ${({ theme }) => theme.colors.adminTextDark};
  }
`;

const DeleteBtn = styled(ActionBtn)`
  &:hover {
    background: #fee2e2;
    color: #b91c1c;
  }
`;
