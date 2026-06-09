import styled from 'styled-components';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import ToggleSwitch from '../common/ToggleSwitch';

const AREA_LABEL = {
  SEOUL: '서울', GYEONGGI: '경기', GANGWON: '강원',
  CHUNGNAM: '충남', CHUNGBUK: '충북', GYEONGNAM: '경남',
  GYEONGBUK: '경북', JEONNAM: '전남', JEONBUK: '전북', JEJU: '제주',
};

const APPROVAL_LABEL = { PENDING: '승인 대기', APPROVED: '승인됨', REJECTED: '반려됨' };
const APPROVAL_COLOR = {
  PENDING:  { bg: '#fef3c7', color: '#92400e' },
  APPROVED: { bg: '#d1fae5', color: '#065f46' },
  REJECTED: { bg: '#fee2e2', color: '#991b1b' },
};

/**
 * 공간 목록 테이블
 * @param {array} spaces SpaceResDto[]
 * @param {function} onToggleVisible (id, visibleYn) => void
 * @param {function} onDetail (id) => void
 * @param {function} onEdit (id) => void
 * @param {function} onDelete (id) => void
 * @param {Set} togglingIds 토글 중인 ID Set
 */
export default function SpaceTable({
  spaces = [],
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
            <Th>공간명</Th>
            <Th>지역</Th>
            <Th>승인 상태</Th>
            <Th>노출여부</Th>
            <Th>등록일</Th>
            <Th>액션</Th>
          </tr>
        </thead>
        <tbody>
          {spaces.map((space) => (
            <Tr key={space.id}>
              <Td>
                <IdText>#{space.id}</IdText>
              </Td>
              <Td>
                <SpaceNameBtn onClick={() => onDetail?.(space.id)}>
                  {space.name}
                </SpaceNameBtn>
              </Td>
              <Td>{AREA_LABEL[space.area] ?? space.area ?? '-'}</Td>
              <Td>
                {space.approvalStatus ? (
                  <ApprovalChip $status={space.approvalStatus}>
                    {APPROVAL_LABEL[space.approvalStatus] ?? space.approvalStatus}
                  </ApprovalChip>
                ) : '-'}
              </Td>
              <Td>
                <VisibleCell>
                  <Badge visibleYn={space.visibleYn} />
                  <ToggleSwitch
                    checked={space.visibleYn === 'Y'}
                    loading={togglingIds.has(space.id)}
                    onChange={(next) => onToggleVisible?.(space.id, next ? 'Y' : 'N')}
                  />
                </VisibleCell>
              </Td>
              <Td>
                {space.createdAt
                  ? new Date(space.createdAt).toLocaleDateString('ko-KR')
                  : '-'}
              </Td>
              <Td>
                <ActionGroup>
                  <ActionBtn title="상세" onClick={() => onDetail?.(space.id)}>
                    <Eye size={15} />
                  </ActionBtn>
                  <ActionBtn title="수정" onClick={() => onEdit?.(space.id)}>
                    <Pencil size={15} />
                  </ActionBtn>
                  <DeleteBtn title="삭제" onClick={() => onDelete?.(space.id)}>
                    <Trash2 size={15} />
                  </DeleteBtn>
                </ActionGroup>
              </Td>
            </Tr>
          ))}
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
  min-width: 700px;
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
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
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

const SpaceNameBtn = styled.button`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: color 0.15s;
  &:hover {
    color: #3ec9a7;
  }
`;

const VisibleCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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

const ApprovalChip = styled.span`
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  white-space: nowrap;
  background: ${({ $status }) => APPROVAL_COLOR[$status]?.bg ?? '#f1f5f9'};
  color: ${({ $status }) => APPROVAL_COLOR[$status]?.color ?? '#475569'};
`;
