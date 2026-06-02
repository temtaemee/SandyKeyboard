import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Star, RefreshCw, MessageSquare, Building2, ChevronDown } from 'lucide-react';
import { sellerReviewApi } from '../api/reviewApi';
import { spaceApi } from '../api/spaceApi';
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

function fmt(dateStr) {
  if (!dateStr) return '-';
  return String(dateStr).slice(0, 10);
}

export default function ReviewPage() {
  const [list, setList]                   = useState([]);
  const [totalPages, setTotalPages]       = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pno, setPno]                     = useState(0);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);

  // 공간 필터
  const [spaces, setSpaces]         = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null); // { id, name } | null = 전체

  // 별점 필터 (클라이언트)
  const [filterRating, setFilterRating] = useState('ALL');

  // 답글 상태
  const [openReplyId, setOpenReplyId]   = useState(null);
  const [replyText, setReplyText]       = useState('');
  const [submittingId, setSubmittingId] = useState(null);
  const [replyError, setReplyError]     = useState(null);

  // 공간 목록 로드
  useEffect(() => {
    spaceApi.getMySpaces()
      .then(res => setSpaces(res.data ?? []))
      .catch(() => {});
  }, []);

  const load = useCallback(async (page = 0, spaceId = null) => {
    setLoading(true); setError(null);
    try {
      const res = await sellerReviewApi.getList(page, spaceId);
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

  useEffect(() => { load(0, null); }, []);

  const handleSpaceChange = (space) => {
    setSelectedSpace(space);
    setFilterRating('ALL');
    setPno(0);
    load(0, space?.id ?? null);
  };

  const handlePage = (page) => load(page, selectedSpace?.id ?? null);

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

  const openReply = (r) => {
    setOpenReplyId(r.id);
    setReplyText(r.sellerReply ?? '');
    setReplyError(null);
  };

  const handleReplySubmit = async (reviewId) => {
    if (!replyText.trim()) return;
    setSubmittingId(reviewId);
    setReplyError(null);
    try {
      await sellerReviewApi.reply(reviewId, replyText.trim());
      setList(prev => prev.map(r =>
        r.id === reviewId ? { ...r, sellerReply: replyText.trim(), sellerRepliedAt: new Date().toISOString() } : r
      ));
      setOpenReplyId(null);
    } catch (e) {
      setReplyError(e.response?.data?.message ?? '답글 등록에 실패했습니다.');
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <Wrap>
      <PageHeader>
        <TitleGroup>
          <PageTitle>리뷰 관리</PageTitle>
          <PageSub>
            {selectedSpace ? `[${selectedSpace.name}] ` : '내 공간에 등록된 리뷰 — '}
            총 {totalElements}건
          </PageSub>
        </TitleGroup>
        <RefreshBtn onClick={() => load(pno, selectedSpace?.id ?? null)} disabled={loading}>
          <RefreshCw size={14} />새로고침
        </RefreshBtn>
      </PageHeader>

      {error && <ErrorBar>{error}</ErrorBar>}

      {/* 공간 필터 */}
      <SpaceFilterRow>
        <Building2 size={14} color="#94a3b8" />
        <SpaceFilterLabel>공간 필터:</SpaceFilterLabel>
        <SpaceSelect
          value={selectedSpace?.id ?? ''}
          onChange={(e) => {
            const id = e.target.value;
            if (!id) { handleSpaceChange(null); return; }
            const space = spaces.find(s => String(s.id) === id);
            handleSpaceChange(space ?? null);
          }}
        >
          <option value="">전체 공간</option>
          {spaces.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </SpaceSelect>
        <ChevronDown size={13} color="#94a3b8" style={{ marginLeft: -24, pointerEvents: 'none' }} />
      </SpaceFilterRow>

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

      {/* 별점 필터 */}
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
            <ReviewCard key={r.id}>
              {/* 헤더: 공간·예약 정보 + 별점·날짜 */}
              <ReviewHeader>
                <MetaLeft>
                  <SpacePath>
                    {r.spaceName && <SpaceChip>{r.spaceName}</SpaceChip>}
                    {r.stayName  && <><PathSep>›</PathSep><StayChip>{r.stayName}</StayChip></>}
                  </SpacePath>
                  <ReservationInfo>
                    {r.reservationId && <ResvBadge>예약 #{r.reservationId}</ResvBadge>}
                    {(r.checkInDate || r.checkOutDate) && (
                      <DateRange>{fmt(r.checkInDate)} ~ {fmt(r.checkOutDate)}</DateRange>
                    )}
                    {r.writer && <GuestName>· {r.writer}</GuestName>}
                  </ReservationInfo>
                </MetaLeft>
                <MetaRight>
                  <StarRow rating={r.rating} />
                  <DateText>{fmt(r.createdAt)}</DateText>
                </MetaRight>
              </ReviewHeader>

              {/* 본문 */}
              <ReviewTitle>{r.title}</ReviewTitle>
              <ReviewContent>{r.content}</ReviewContent>
              {r.tag && <TagText>{r.tag}</TagText>}

              {/* 답글 영역 */}
              <ReplySection>
                {r.sellerReply && openReplyId !== r.id ? (
                  <ExistingReply>
                    <ReplyLabel>
                      <MessageSquare size={12} />셀러 답글
                      {r.sellerRepliedAt && <ReplyDate>{fmt(r.sellerRepliedAt)}</ReplyDate>}
                    </ReplyLabel>
                    <ReplyText>{r.sellerReply}</ReplyText>
                    <ReplyEditBtn onClick={() => openReply(r)}>수정</ReplyEditBtn>
                  </ExistingReply>
                ) : openReplyId === r.id ? (
                  <ReplyForm>
                    <ReplyTextarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="답글을 입력하세요..."
                      rows={3}
                    />
                    {replyError && <ReplyErr>{replyError}</ReplyErr>}
                    <ReplyActions>
                      <ReplyCancelBtn onClick={() => setOpenReplyId(null)}>취소</ReplyCancelBtn>
                      <ReplySubmitBtn
                        onClick={() => handleReplySubmit(r.id)}
                        disabled={!replyText.trim() || submittingId === r.id}
                      >
                        {submittingId === r.id ? '등록 중...' : '답글 등록'}
                      </ReplySubmitBtn>
                    </ReplyActions>
                  </ReplyForm>
                ) : (
                  <ReplyOpenBtn onClick={() => openReply(r)}>
                    <MessageSquare size={13} />답글 달기
                  </ReplyOpenBtn>
                )}
              </ReplySection>
            </ReviewCard>
          ))}
        </ReviewList>
      )}

      <SellerPagination pno={pno} total={totalPages} onPage={handlePage} />
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

/* 공간 필터 */
const SpaceFilterRow = styled.div`
  display: flex; align-items: center; gap: 8px;
`;
const SpaceFilterLabel = styled.span`font-size: 13px; color: ${({ theme }) => theme.colors.textMuted};`;
const SpaceSelect = styled.select`
  height: 34px; padding: 0 32px 0 12px; border-radius: 8px; font-size: 13px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.adminTextDark};
  background: white; font-family: inherit; cursor: pointer;
  appearance: none;
  &:focus { outline: none; border-color: ${ACCENT}; }
`;

/* 평점 요약 */
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

/* 별점 필터 */
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

/* 리뷰 카드 */
const ReviewList = styled.div`display: flex; flex-direction: column; gap: 12px;`;
const ReviewCard = styled.div`
  background: white; border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px; padding: 20px; box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex; flex-direction: column; gap: 10px;
`;

const ReviewHeader = styled.div`display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;`;

const MetaLeft = styled.div`display: flex; flex-direction: column; gap: 4px;`;
const SpacePath = styled.div`display: flex; align-items: center; gap: 6px;`;
const SpaceChip = styled.span`font-size: 12px; font-weight: 700; color: ${ACCENT};`;
const PathSep   = styled.span`font-size: 12px; color: #94a3b8;`;
const StayChip  = styled.span`font-size: 12px; font-weight: 600; color: ${({ theme }) => theme.colors.textMid};`;

const ReservationInfo = styled.div`display: flex; align-items: center; gap: 8px; flex-wrap: wrap;`;
const ResvBadge = styled.span`
  font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 20px;
  background: #f1f5f9; color: #475569;
`;
const DateRange = styled.span`font-size: 11px; color: ${({ theme }) => theme.colors.textMuted};`;
const GuestName = styled.span`font-size: 11px; color: ${({ theme }) => theme.colors.textMuted};`;

const MetaRight = styled.div`display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0;`;
const DateText  = styled.span`font-size: 11px; color: ${({ theme }) => theme.colors.textLight};`;

const ReviewTitle   = styled.p`font-size: 14px; font-weight: 600; color: ${({ theme }) => theme.colors.adminTextDark};`;
const ReviewContent = styled.p`font-size: 13px; color: ${({ theme }) => theme.colors.textMid}; line-height: 1.6;`;
const TagText = styled.span`
  display: inline-block; font-size: 11px; color: ${ACCENT};
  background: ${ACCENT}15; padding: 2px 8px; border-radius: 20px;
`;

/* 답글 영역 */
const ReplySection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding-top: 12px;
  margin-top: 2px;
`;

const ExistingReply = styled.div`
  background: #f8fafc; border-radius: 8px; padding: 12px 14px;
  position: relative;
`;
const ReplyLabel = styled.div`
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 700; color: ${ACCENT}; margin-bottom: 6px;
`;
const ReplyDate = styled.span`font-size: 10px; color: #94a3b8; font-weight: 400; margin-left: 4px;`;
const ReplyText = styled.p`font-size: 13px; color: ${({ theme }) => theme.colors.textMid}; line-height: 1.6;`;
const ReplyEditBtn = styled.button`
  position: absolute; top: 10px; right: 12px;
  font-size: 11px; color: #94a3b8; font-family: inherit; cursor: pointer;
  &:hover { color: ${ACCENT}; }
`;

const ReplyOpenBtn = styled.button`
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; color: #94a3b8; font-family: inherit; cursor: pointer;
  transition: color 0.15s;
  &:hover { color: ${ACCENT}; }
`;

const ReplyForm = styled.div`display: flex; flex-direction: column; gap: 8px;`;
const ReplyTextarea = styled.textarea`
  width: 100%; padding: 10px 12px; border-radius: 8px; font-size: 13px; font-family: inherit;
  border: 1px solid ${({ theme }) => theme.colors.border};
  resize: vertical; line-height: 1.6;
  &:focus { outline: none; border-color: ${ACCENT}; }
`;
const ReplyErr = styled.p`font-size: 12px; color: #b91c1c;`;
const ReplyActions = styled.div`display: flex; justify-content: flex-end; gap: 8px;`;
const ReplyCancelBtn = styled.button`
  height: 32px; padding: 0 14px; border-radius: 8px; font-size: 12px; font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.border}; background: white;
  color: ${({ theme }) => theme.colors.textMid}; font-family: inherit; cursor: pointer;
`;
const ReplySubmitBtn = styled.button`
  height: 32px; padding: 0 16px; border-radius: 8px; font-size: 12px; font-weight: 600;
  background: ${ACCENT}; color: white; font-family: inherit; cursor: pointer;
  transition: background 0.15s;
  &:hover:not(:disabled) { background: #31b08e; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;
