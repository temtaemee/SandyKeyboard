// src/features/admin/components/dashboard/AdminActivityTable.jsx
import { useState } from 'react';
import styled from 'styled-components';
import AdminPagination from '../common/AdminPagination';
import StatusBadge from '../common/StatusBadge';
import { ADMIN_ACTIVITY_LOGS } from '../../data/adminDashboardData';
import { STATUS_MAP } from '../../data/adminDashboardConstants';

const TOTAL = 2401;
const PER_PAGE = 4;
const TOTAL_PAGES = Math.ceil(TOTAL / PER_PAGE);

export default function AdminActivityTable() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <TableSection>
      {/* 헤더 */}
      <TableHeader>
        <HeaderLeft>
          <TableTitle>최근 관리 활동 내역</TableTitle>
          <TableSub>판매자별 작업 히스토리</TableSub>
        </HeaderLeft>
        <TotalBadge>총 {TOTAL.toLocaleString()}건</TotalBadge>
      </TableHeader>

      {/* 테이블 */}
      <Table>
        <THead>
          <TR>
            <TH $width="147px">활동 ID</TH>
            <TH $width="131px">판매자</TH>
            <TH $width="194px">작업 내용</TH>
            <TH $width="225px">대상 항목</TH>
            <TH $width="192px">일시</TH>
            <TH $width="93px">상태</TH>
          </TR>
        </THead>
        <TBody>
          {ADMIN_ACTIVITY_LOGS.map((log) => (
            <TR key={log.id} $hoverable>
              <TD>
                <LogId>{log.id}</LogId>
              </TD>
              <TD>
                <AdminCell>
                  <Avatar $bg={log.avatarBg} $color={log.avatarColor}>
                    {log.adminInitials}
                  </Avatar>
                  <AdminName>{log.adminName}</AdminName>
                </AdminCell>
              </TD>
              <TD $indent>
                <ActionText>{log.action}</ActionText>
              </TD>
              <TD>
                <TargetText>{log.target}</TargetText>
              </TD>
              <TD>
                <DateText>{log.datetime}</DateText>
              </TD>
              <TD>
                <StatusBadge
                  $bg={STATUS_MAP[log.status].bg}
                  $color={STATUS_MAP[log.status].color}
                >
                  {STATUS_MAP[log.status].label}
                </StatusBadge>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>

      {/* 페이지네이션 */}
      <TableFooter>
        <FooterInfo>총 {TOTAL.toLocaleString()}개의 항목</FooterInfo>
        <AdminPagination
          currentPage={currentPage}
          totalPages={TOTAL_PAGES}
          onPageChange={setCurrentPage}
        />
        <div style={{ width: '120px' }} />
      </TableFooter>
    </TableSection>
  );
}



/* ── Styled Components ── */

const TableSection = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TableTitle = styled.h2`
  font-size: 20px;
  font-weight: 500;
  color: #0d1c2e;
  line-height: 1.4;
`;

const TableSub = styled.p`
  font-size: 13px;
  color: #64748b;
`;

const TotalBadge = styled.div`
  padding: 3px 12px 4.5px;
  background: #f1f5f9;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const THead = styled.thead`
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
`;

const TBody = styled.tbody``;

const TR = styled.tr`
  border-top: ${({ $hoverable }) =>
    $hoverable ? '1px solid #f1f5f9' : 'none'};
  transition: background 0.1s;

  &:hover {
    background: ${({ $hoverable }) => ($hoverable ? '#fafbfc' : 'transparent')};
  }
`;

const TH = styled.th`
  padding: 12px 24px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  width: ${({ $width }) => $width || 'auto'};
  white-space: nowrap;
`;

const TD = styled.td`
  padding: 19.5px 24px;
  vertical-align: middle;
  padding-left: ${({ $indent }) => ($indent ? '48px' : '24px')};
`;

const LogId = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #0f172a;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const AdminCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Avatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  flex-shrink: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const AdminName = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #334155;
`;

const ActionText = styled.span`
  font-size: 13px;
  color: #475569;
`;

const TargetText = styled.span`
  font-size: 13px;
  color: #475569;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const DateText = styled.span`
  font-size: 13px;
  color: #94a3b8;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;



/* 페이지네이션 푸터 */
const TableFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 17px 16px 16px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
`;

const FooterInfo = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.6px;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;
