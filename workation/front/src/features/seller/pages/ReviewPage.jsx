import { useState } from 'react';
import styled from 'styled-components';
import { Star, MessageSquare, ChevronDown, ChevronUp, Send } from 'lucide-react';

const ACCENT = '#3ec9a7';

const MOCK_REVIEWS = [
  { id: 1, spaceName: '제주 오션뷰 워크', stayName: '디럭스 오션뷰', guestName: '김*민', rating: 5, content: '정말 최고의 워케이션이었습니다. 뷰가 아름답고 업무 공간도 쾌적했어요. 다음에도 꼭 재방문하고 싶습니다.', createdAt: '2025-05-20', reply: null },
  { id: 2, spaceName: '서울 도심 워케이션', stayName: '스탠다드 A룸', guestName: '이*진', rating: 4, content: '위치가 좋고 시설이 깔끔했습니다. 와이파이 속도가 빠르고 모니터도 제공되어서 업무 효율이 올랐어요.', createdAt: '2025-05-18', reply: '감사합니다! 다음에도 좋은 경험 드릴게요.' },
  { id: 3, spaceName: '제주 오션뷰 워크', stayName: '스탠다드 오션뷰', guestName: '박*수', rating: 3, content: '전반적으로는 좋았지만 체크인 절차가 복잡했습니다. 시설은 만족스러웠어요.', createdAt: '2025-05-15', reply: null },
  { id: 4, spaceName: '강원 힐링 스테이', stayName: '패밀리룸', guestName: '최*영', rating: 5, content: '자연 속에서 일하는 경험이 정말 특별했습니다. 직원 분들도 친절하시고 식사도 맛있었어요!', createdAt: '2025-05-10', reply: '소중한 후기 감사합니다 :) 다시 뵙겠습니다!' },
  { id: 5, spaceName: '서울 도심 워케이션', stayName: '프리미엄 B룸', guestName: '정*현', rating: 2, content: '방 내부 청결도가 아쉬웠습니다. 개선이 필요할 것 같습니다.', createdAt: '2025-05-08', reply: null },
  { id: 6, spaceName: '강원 힐링 스테이', stayName: '스탠다드 숲뷰', guestName: '강*우', rating: 4, content: '숲 뷰가 정말 힐링됩니다. 다만 주차 공간이 좁습니다.', createdAt: '2025-05-03', reply: null },
];

const SPACES = ['전체', '제주 오션뷰 워크', '서울 도심 워케이션', '강원 힐링 스테이'];

function StarRow({ rating, size = 14 }) {
  return (
    <Stars>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          fill={s <= rating ? '#f59e0b' : 'none'}
          color={s <= rating ? '#f59e0b' : '#cbd5e1'}
        />
      ))}
    </Stars>
  );
}

export default function ReviewPage() {
  const [filterSpace, setFilterSpace] = useState('전체');
  const [filterRating, setFilterRating] = useState('ALL');
  const [replyOpen, setReplyOpen] = useState({});
  const [replyText, setReplyText] = useState({});
  const [replies, setReplies] = useState({});
  const [submitting, setSubmitting] = useState({});

  const filtered = MOCK_REVIEWS.filter((r) => {
    const spaceMatch = filterSpace === '전체' || r.spaceName === filterSpace;
    const ratingMatch = filterRating === 'ALL' || r.rating === Number(filterRating);
    return spaceMatch && ratingMatch;
  });

  const avgRating = MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / MOCK_REVIEWS.length;
  const ratingDist = [5, 4, 3, 2, 1].map((s) => ({
    score: s,
    count: MOCK_REVIEWS.filter((r) => r.rating === s).length,
  }));

  const toggleReply = (id) => setReplyOpen((p) => ({ ...p, [id]: !p[id] }));

  const submitReply = async (id) => {
    const text = replyText[id]?.trim();
    if (!text) return;
    setSubmitting((p) => ({ ...p, [id]: true }));
    await new Promise((r) => setTimeout(r, 700));
    setReplies((p) => ({ ...p, [id]: text }));
    setReplyOpen((p) => ({ ...p, [id]: false }));
    setReplyText((p) => ({ ...p, [id]: '' }));
    setSubmitting((p) => ({ ...p, [id]: false }));
  };

  return (
    <Wrap>
      <PageHeader>
        <TitleGroup>
          <PageTitle>리뷰 관리</PageTitle>
          <PageSub>고객 리뷰를 확인하고 답글을 달 수 있습니다</PageSub>
        </TitleGroup>
      </PageHeader>

      {/* 통계 섹션 */}
      <StatsGrid>
        <AvgCard>
          <AvgLabel>전체 평균 평점</AvgLabel>
          <AvgRow>
            <AvgValue>{avgRating.toFixed(1)}</AvgValue>
            <StarRow rating={Math.round(avgRating)} size={20} />
          </AvgRow>
          <AvgNote>총 {MOCK_REVIEWS.length}개 리뷰</AvgNote>
        </AvgCard>

        <DistCard>
          {ratingDist.map(({ score, count }) => {
            const pct = MOCK_REVIEWS.length > 0 ? (count / MOCK_REVIEWS.length) * 100 : 0;
            return (
              <DistRow key={score}>
                <DistLabel>{score}점</DistLabel>
                <DistBar>
                  <DistFill $pct={pct} />
                </DistBar>
                <DistCount>{count}</DistCount>
              </DistRow>
            );
          })}
        </DistCard>
      </StatsGrid>

      {/* 필터 */}
      <FilterBar>
        <FilterSelect value={filterSpace} onChange={(e) => setFilterSpace(e.target.value)}>
          {SPACES.map((s) => <option key={s} value={s}>{s}</option>)}
        </FilterSelect>
        <FilterSelect value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
          <option value="ALL">전체 평점</option>
          {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s}점</option>)}
        </FilterSelect>
        <ResultCount>{filtered.length}개 리뷰</ResultCount>
      </FilterBar>

      {/* 리뷰 목록 */}
      <ReviewList>
        {filtered.length === 0 ? (
          <EmptyState>
            <Star size={36} color="#cbd5e1" />
            <EmptyMsg>해당 조건의 리뷰가 없습니다</EmptyMsg>
          </EmptyState>
        ) : (
          filtered.map((r) => {
            const hasReply = r.reply || replies[r.id];
            const currentReply = replies[r.id] ?? r.reply;
            return (
              <ReviewCard key={r.id}>
                <ReviewTop>
                  <ReviewMeta>
                    <GuestName>{r.guestName}</GuestName>
                    <SpaceTag>{r.spaceName} · {r.stayName}</SpaceTag>
                  </ReviewMeta>
                  <ReviewRight>
                    <StarRow rating={r.rating} />
                    <ReviewDate>{r.createdAt}</ReviewDate>
                  </ReviewRight>
                </ReviewTop>

                <ReviewContent>{r.content}</ReviewContent>

                {currentReply && (
                  <ReplyBox>
                    <ReplyLabel>셀러 답글</ReplyLabel>
                    <ReplyText>{currentReply}</ReplyText>
                  </ReplyBox>
                )}

                {!hasReply && (
                  <ReplyToggle onClick={() => toggleReply(r.id)}>
                    <MessageSquare size={13} />
                    {replyOpen[r.id] ? '취소' : '답글 달기'}
                    {replyOpen[r.id] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </ReplyToggle>
                )}

                {replyOpen[r.id] && (
                  <ReplyInputRow>
                    <ReplyInput
                      value={replyText[r.id] ?? ''}
                      onChange={(e) => setReplyText((p) => ({ ...p, [r.id]: e.target.value }))}
                      placeholder="고객에게 답글을 작성하세요..."
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) submitReply(r.id);
                      }}
                    />
                    <SendBtn
                      onClick={() => submitReply(r.id)}
                      disabled={submitting[r.id] || !replyText[r.id]?.trim()}
                    >
                      <Send size={14} />
                    </SendBtn>
                  </ReplyInputRow>
                )}
              </ReviewCard>
            );
          })
        )}
      </ReviewList>
    </Wrap>
  );
}

/* ── Styled ── */

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div``;
const TitleGroup = styled.div`display: flex; flex-direction: column; gap: 4px;`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  letter-spacing: -0.4px;
`;

const PageSub = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Stars = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 20px;
`;

const AvgCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const AvgLabel = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const AvgRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AvgValue = styled.p`
  font-size: 40px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: ${({ theme }) => theme.fonts.number};
  line-height: 1;
`;

const AvgNote = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DistCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const DistRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DistLabel = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  width: 28px;
  flex-shrink: 0;
`;

const DistBar = styled.div`
  flex: 1;
  height: 8px;
  background: ${({ theme }) => theme.colors.borderLight};
  border-radius: 999px;
  overflow: hidden;
`;

const DistFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: #f59e0b;
  border-radius: 999px;
  transition: width 0.4s ease;
`;

const DistCount = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  width: 20px;
  text-align: right;
  flex-shrink: 0;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterSelect = styled.select`
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  background: white;
  font-family: inherit;
  cursor: pointer;
`;

const ResultCount = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: auto;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 64px;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
`;

const EmptyMsg = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ReviewCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const ReviewTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const ReviewMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const GuestName = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminTextDark};
`;

const SpaceTag = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ReviewRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const ReviewDate = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ReviewContent = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMid};
  line-height: 1.7;
`;

const ReplyBox = styled.div`
  background: ${({ theme }) => theme.colors.bgSection};
  border-left: 3px solid ${ACCENT};
  border-radius: 0 8px 8px 0;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ReplyLabel = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: ${ACCENT};
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const ReplyText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMid};
  line-height: 1.6;
`;

const ReplyToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: inherit;
  cursor: pointer;
  align-self: flex-start;
  transition: color 0.15s;
  &:hover {
    color: ${ACCENT};
  }
`;

const ReplyInputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

const ReplyInput = styled.textarea`
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.adminTextDark};
  font-family: inherit;
  resize: none;
  line-height: 1.5;
  &:focus {
    outline: none;
    border-color: ${ACCENT};
    box-shadow: 0 0 0 3px ${ACCENT}22;
  }
`;

const SendBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: ${({ disabled }) => (disabled ? '#e2e8f0' : ACCENT)};
  color: ${({ disabled }) => (disabled ? '#94a3b8' : 'white')};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.15s;
  flex-shrink: 0;
  &:hover:not(:disabled) {
    background: #31b08e;
  }
`;
