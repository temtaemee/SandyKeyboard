import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Star, RefreshCw } from 'lucide-react';
import { sellerReviewApi } from '../api/reviewApi';
import SellerPagination from '../components/common/SellerPagination';

const ACCENT = '#3ec9a7';

function StarRow({ rating, size = 14 }) {
  return (
    <Stars>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size}
          fill={s <= rating ? '#f59e0b' : 'none'}
          color={s <= rating ? '#f59e0b' : '#cbd5e1'}
        />
      ))}
    </Stars>
  );
}

export default function ReviewPage() {
  const [list, setList]             = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pno, setPno]               = useState(0);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [filterRating, setFilterRating] = useState('ALL');

  const load = useCallback(async (page = 0) => {
    setLoading(true); setError(null);
    try {
      const res = await sellerReviewApi.getList(page);
      const data = res.data;
      setList(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
      setPno(page);
    } catch (e) {
      setError(e.response?.data?.message ?? '리뷰 데이터를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(0); }, []);

  const filtered = filterRating === 'ALL'
    ? list
    : list.filter((r) => r.rating === Number(filterRating));

  const avgRating = list.length > 0
    ? (list.reduce((s, r) => s + (r.rating ?? 0), 0) / list.length).toFixed(1)
    : '-';

  const ratingDist = [5, 4, 3, 2, 1].map((s) => ({
    score: s,
    count: list.filter((r) => r.rating === s).length,
  }));
  const maxCount = Math.max(...ratingDist.map((d) => d.count), 1);

  return (
    <Wrap>
      <PageHeader>
        <TitleGroup>
          <PageTitle>리뷰 관리</PageTitle>
          <PageSub>내 공간에 등록된 리뷰 — 총 {totalElements}건</PageSub>
        </TitleGroup>
        <RefreshBtn onClick={() => load(pno)} disabled={loading}>
          <RefreshCw size={14} />새로고침
        </RefreshBtn>
      </PageHeader>

      {error && <ErrorBar>{error}</ErrorBar>}

      {/* 평점 요약 */}
      <SummaryCard>
        <AvgBox>
          <AvgNum>{avgRating}</AvgNum>
          <StarRow rating={Math.round(Number(avgRating))} size={18} />
          <AvgSub>{totalElements}개 리뷰</AvgSub>
        </AvgBox>
        <DistBox>
          {ratingDist.map((d) => (
            <DistRow key={d.score}>
              <DistLabel>{d.score}점</DistLabel>
              <DistBarWrap>
                <DistBar $pct={maxCount > 0 ? (d.count / maxCount) * 100 : 0} />
              </DistBarWrap>
              <DistCount>{d.count}</DistCount>
            </DistRow>
          ))}
        </DistBox>
      </SummaryCard>

      {/* 필터 */}
      <FilterRow>
        <FilterLabel>별점 필터:</FilterLabel>
        {['ALL', '5', '4', '3', '2', '1'].map((v) => (
          <FilterBtn key={v} $active={filterRating === v} onClick={() => setFilterRating(v)}>
            {v === 'ALL' ? '전체' : `${v}점`}
          </FilterBtn>
        ))}
      </FilterRow>

      {/* 리뷰 목록 */}
      {loading ? (
        <LoadArea>불러오는 중...</LoadArea>
      ) : filtered.length === 0 ? (
        <LoadArea>리뷰가 없습니다</LoadArea>
      ) : (
        <ReviewList>
          {filtered.map((r) => (
            <ReviewCard key={r.reviewId}>
              <ReviewHeader>
                <ReviewMeta>
                  <SpaceName>{r.spaceName}</SpaceName>
                  <GuestName>{r.memberName}</GuestName>
                </ReviewMeta>
                <RatingDate>
                  <StarRow rating={r.rating} />
                  <DateText>{r.createdAt?.slice(0, 10)}</DateText>
                </RatingDate>
              </ReviewHeader>
              <ReviewTitle>{r.title}</ReviewTitle>
              <ReviewContent>{r.content}</ReviewContent>
              {r.tag && <TagText>{r.tag}</TagText>}
            </ReviewCard>
          ))}
        </ReviewList>
      )}

      <SellerPagination pno={pno} total={totalPages} onPage={load} />
    </Wrap>
  );
}

/* ── Styled ── */

const Wrap = styled.div`display: flex; flex-direction: column; gap: 20px;`;
const PageHeader = styled.div`display: flex; align-items: flex-start; justify-content: space-between;`;
const TitleGroup = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const PageTitle  = styled.h1`font-size: 24px; font-weight: 700; color: ${({ theme }) => theme.colors.adminTextDark}; letter-spacing: -0.4px;`;
const PageSub    = styled.p`font-size: 14px; color: ${({ theme }) => theme.colors.textMuted};`;
const RefreshBtn = styled.button`
  display: flex; align-items: center; gap: 6px; height: 34px; padding: 0 14px; border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border}; font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid}; background: white; font-family: inherit;
  cursor: pointer; opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  &:hover:not(:disabled) { border-color: ${ACCENT}; color: ${ACCENT}; }
`;
const ErrorBar = styled.p`padding: 12px 16px; background: #fee2e2; color: #b91c1c; font-size: 13px; border-radius: 8px;`;

const SummaryCard = styled.div`
  display: flex; gap: 32px; align-items: center;
  background: white; border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px; padding: 24px; box-shadow: ${({ theme }) => theme.shadows.card};
`;
const AvgBox = styled.div`display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 100px;`;
const AvgNum = styled.p`font-size: 48px; font-weight: 800; color: ${({ theme }) => theme.colors.adminTextDark}; line-height: 1;`;
const AvgSub = styled.p`font-size: 12px; color: ${({ theme }) => theme.colors.textMuted};`;
const Stars  = styled.div`display: flex; gap: 2px;`;

const DistBox = styled.div`flex: 1; display: flex; flex-direction: column; gap: 6px;`;
const DistRow = styled.div`display: flex; align-items: center; gap: 10px;`;
const DistLabel = styled.span`font-size: 12px; color: ${({ theme }) => theme.colors.textMuted}; width: 26px; text-align: right;`;
const DistBarWrap = styled.div`flex: 1; height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden;`;
const DistBar = styled.div`height: 100%; width: ${({ $pct }) => $pct}%; background: #f59e0b; border-radius: 4px; transition: width 0.3s;`;
const DistCount = styled.span`font-size: 12px; color: ${({ theme }) => theme.colors.textMuted}; width: 20px;`;

const FilterRow = styled.div`display: flex; align-items: center; gap: 8px;`;
const FilterLabel = styled.span`font-size: 13px; color: ${({ theme }) => theme.colors.textMuted};`;
const FilterBtn = styled.button`
  height: 30px; padding: 0 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
  font-family: inherit; cursor: pointer;
  border: 1px solid ${({ $active }) => $active ? ACCENT : '#e2e8f0'};
  background: ${({ $active }) => $active ? ACCENT : 'white'};
  color: ${({ $active }) => $active ? 'white' : '#64748b'}; transition: all 0.15s;
`;

const LoadArea = styled.div`padding: 60px; text-align: center; font-size: 14px; color: ${({ theme }) => theme.colors.textMuted};`;

const ReviewList = styled.div`display: flex; flex-direction: column; gap: 12px;`;
const ReviewCard = styled.div`
  background: white; border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px; padding: 20px; box-shadow: ${({ theme }) => theme.shadows.card};
`;
const ReviewHeader = styled.div`display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px;`;
const ReviewMeta = styled.div`display: flex; flex-direction: column; gap: 2px;`;
const SpaceName = styled.p`font-size: 12px; font-weight: 600; color: ${ACCENT};`;
const GuestName = styled.p`font-size: 13px; color: ${({ theme }) => theme.colors.textMuted};`;
const RatingDate = styled.div`display: flex; flex-direction: column; align-items: flex-end; gap: 4px;`;
const DateText = styled.span`font-size: 11px; color: ${({ theme }) => theme.colors.textLight};`;
const ReviewTitle = styled.p`font-size: 14px; font-weight: 600; color: ${({ theme }) => theme.colors.adminTextDark}; margin-bottom: 6px;`;
const ReviewContent = styled.p`font-size: 13px; color: ${({ theme }) => theme.colors.textMid}; line-height: 1.6;`;
const TagText = styled.span`display: inline-block; margin-top: 8px; font-size: 11px; color: ${ACCENT}; background: ${ACCENT}15; padding: 2px 8px; border-radius: 20px;`;

