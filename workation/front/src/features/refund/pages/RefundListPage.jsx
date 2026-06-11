import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { refundApi } from '../api/refundApi';
import styled from 'styled-components';

export default function RefundListPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [pageInfo, setPageInfo] = useState({ pno: 0, totalPages: 0 });
  const [isAdminOrSeller, setIsAdminOrSeller] = useState(false);

  const loadList = async (page = 0) => {
    try {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        setIsAdminOrSeller(true);
        const data = await refundApi.getAdminRefundList(page);
        setList(data.content);
        setPageInfo({ pno: data.number, totalPages: data.totalPages });
      } else if (path.startsWith('/seller')) {
        setIsAdminOrSeller(true);
        const data = await refundApi.getSellerRefundList(page);
        setList(data.content);
        setPageInfo({ pno: data.number, totalPages: data.totalPages });
      } else {
        setIsAdminOrSeller(false);
        const data = await refundApi.getMyRefundList();
        setList(data);
      }
    } catch (error) {
      alert('환불 목록을 불러오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    loadList(0);
  }, []);

  const handleDetailClick = (id) => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) navigate(`/admin/refund/${id}`);
    else if (path.startsWith('/seller')) navigate(`/seller/refund/${id}`);
    else navigate(`/resv/refund/detail/${id}`);
  };

  const isAdmin = window.location.pathname.startsWith('/admin');

  return (
    <ListContainer>
      <h2> 취소 / 환불 처리 내역 리스트</h2>
      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>환불 번호</th>
              <th>숙소명</th>
              <th>신청자 (아이디)</th>
              <th>환불 금액</th>
              <th>사유 코드</th>
              <th>취소 완료일</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: 'center', padding: '40px' }}
                >
                  처리된 환불 내역이 없습니다.
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr key={item.refundId}>
                  <td className="num-col">{item.refundId}</td>
                  <td>
                    <strong>{item.stayName}</strong>
                  </td>
                  <td>
                    {item.guestName}{' '}
                    <span className="user-id">
                      ({item.memberUsername || '비회원'})
                    </span>
                  </td>
                  <td className="refund-amt">
                    {item.refundAmount?.toLocaleString()}원
                  </td>
                  <td>
                    <span className="reason-tag">{item.refundReasonLabel}</span>
                  </td>
                  <td className="num-col">
                    {new Date(item.refundedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <ViewBtn
                      $isAdmin={isAdmin}
                      onClick={() => handleDetailClick(item.refundId)}
                    >
                      상세 보기
                    </ViewBtn>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableCard>

      {isAdminOrSeller && pageInfo.totalPages > 1 && (
        <PaginationZone>
          {Array.from({ length: pageInfo.totalPages }, (_, i) => (
            <PageBtn
              key={i}
              $active={i === pageInfo.pno}
              $isAdmin={isAdmin}
              onClick={() => loadList(i)}
            >
              {i + 1}
            </PageBtn>
          ))}
        </PaginationZone>
      )}
    </ListContainer>
  );
}

// ================= Styled Components =================
const ListContainer = styled.div`
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;

  h2 {
    font-size: 24px;
    color: ${({ theme }) => theme.colors.textDark};
    margin-bottom: 20px;
  }
`;

const TableCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
    text-align: left;
    font-size: 15px;
  }

  th {
    background: ${({ theme }) => theme.colors.bgSection};
    color: ${({ theme }) => theme.colors.textDark};
    font-weight: 600;
  }

  td {
    color: ${({ theme }) => theme.colors.textMid};
  }

  .num-col {
    font-family: ${({ theme }) => theme.fonts.number};
  }

  .user-id {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 14px;
  }

  .refund-amt {
    color: ${({ theme }) => theme.colors.primary};
    font-family: ${({ theme }) => theme.fonts.number};
    font-weight: 700;
  }

  .reason-tag {
    background: ${({ theme }) => theme.colors.accentBlue};
    color: ${({ theme }) => theme.colors.primary};
    padding: 4px 10px;
    border-radius: ${({ theme }) => theme.radius.full};
    font-size: 13px;
    font-weight: bold;
  }
`;

const ViewBtn = styled.button`
  padding: 6px 14px;
  background: ${({ theme, $isAdmin }) =>
    $isAdmin ? theme.colors.adminPrimary : theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.sm};
  cursor: pointer;
  font-size: 13px;
  font-weight: bold;
  transition: background 0.2s;

  &:hover {
    background: ${({ theme, $isAdmin }) =>
      $isAdmin ? theme.colors.adminPrimaryLight : theme.colors.primaryLight};
  }
`;

const PaginationZone = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 8px;
`;

const PageBtn = styled.button`
  padding: 8px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.fonts.number};
  background: ${({ theme, $active, $isAdmin }) =>
    $active
      ? $isAdmin
        ? theme.colors.adminPrimary
        : theme.colors.primary
      : theme.colors.white};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.white : theme.colors.textMid};
  font-weight: bold;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme, $isAdmin }) =>
      $isAdmin ? theme.colors.adminPrimary : theme.colors.primary};
  }
`;
