import styled from 'styled-components';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import ToggleSwitch from '../common/ToggleSwitch';

/**
 * 스테이 목록 테이블
 * @param {array} stays StayResDto[]
 * @param {object} spacesMap { [spaceId]: spaceName }
 * @param {function} onToggleVisible (id, visibleYn) => void
 * @param {function} onDetail (id) => void
 * @param {function} onEdit (id) => void
 * @param {function} onDelete (id) => void
 * @param {Set} togglingIds
 */
export default function StayTable({
  stays = [],
  spacesMap = {},
  onToggleVisible,
  onDetail,
  onEdit,
  onDelete,
  togglingIds = new Set(),
}) {
  return (
    <TableWrap>
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>스테이명</Th>
            <Th>공간명</Th>
            <Th>워케이션</Th>
            <Th>노출여부</Th>
            <Th>주중 단가</Th>
            <Th>등록일</Th>
            <Th>액션</Th>
          </tr>
        </thead>
        <tbody>
          {stays.map((stay) => {
            const monPrice = stay.monPrice != null
              ? `${Number(stay.monPrice).toLocaleString()}원`
              : '-';
            const spaceName = spacesMap[stay.spaceId] ?? `공간 #${stay.spaceId}`;

            return (
              <Tr key={stay.id}>
                <Td><IdText>#{stay.id}</IdText></Td>
                <Td>
                  <StayNameBtn onClick={() => onDetail?.(stay.id)}>
                    {stay.name}
                  </StayNameBtn>
                </Td>
                <Td>{spaceName}</Td>
                <Td>
                  {stay.workationYn === 'Y' ? (
                    <WorkBadge>워케이션</WorkBadge>
                  ) : (
                    <NormalBadge>일반</NormalBadge>
                  )}
                </Td>
                <Td>
                  <VisibleCell>
                    <Badge visibleYn={stay.visibleYn} />
                    <ToggleSwitch
                      checked={stay.visibleYn === 'Y'}
                      loading={togglingIds.has(stay.id)}
                      onChange={(next) => onToggleVisible?.(stay.id, next ? 'Y' : 'N')}
                    />
                  </VisibleCell>
                </Td>
                <Td>
                  <PriceText>{monPrice}</PriceText>
                </Td>
                <Td>
                  {stay.createdAt
                    ? new Date(stay.createdAt).toLocaleDateString('ko-KR')
                    : '-'}
                </Td>
                <Td>
                  <ActionGroup>
                    <ActionBtn title="상세" onClick={() => onDetail?.(stay.id)}>
                      <Eye size={15} />
                    </ActionBtn>
                    <ActionBtn title="수정" onClick={() => onEdit?.(stay.id)}>
                      <Pencil size={15} />
                    </ActionBtn>
                    <DeleteBtn title="삭제" onClick={() => onDelete?.(stay.id)}>
                      <Trash2 size={15} />
                    </DeleteBtn>
                  </ActionGroup>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </TableWrap>
  );
}

const TableWrap = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.6px;
  background: ${({ theme }) => theme.colors.bgSection};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
`;

const Tr = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  &:last-child { border-bottom: none; }
  &:hover { background: ${({ theme }) => theme.colors.bgSection}; }
`;

const Td = styled.td`
  padding: 14px 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  vertical-align: middle;
`;

const IdText = styled.span`
  font-family: ${({ theme }) => theme.fonts.number};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StayNameBtn = styled.button`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: color 0.15s;
  &:hover { color: #3ec9a7; }
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

const NormalBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: #f1f5f9;
  color: #64748b;
`;

const VisibleCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PriceText = styled.span`
  font-family: ${({ theme }) => theme.fonts.number};
  font-size: 13px;
  font-weight: 600;
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
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
