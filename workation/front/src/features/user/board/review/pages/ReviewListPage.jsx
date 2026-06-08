import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getReviewList,
  deleteReview,
  getComments,
  createComment,
  deleteComment,
  getImageUrl,
  getReviewLike,
  toggleReviewLike,
  getCommentLike,
  toggleCommentLike,
} from '../api/reviewApi';
import {
  Wrapper,
  ListHeader,
  ReviewCount,
  Strong,
  FeedList,
  Card,
  CardHeader,
  Avatar,
  HeaderRight,
  TitleRow,
  CardTitle,
  CardActions,
  ActionBtn,
  WriterMeta,
  WriterName,
  DateText,
  ReviewLikeBtnWrapper,
  ImageGrid,
  ImageItem,
  MoreImageOverlay,
  ContentArea,
  CardContent,
  MoreBtn,
  CommentToggleBtn,
  CommentArea,
  CommentLoading,
  CommentList,
  CommentCard,
  CommentTop,
  CommentAvatar,
  CommentWriter,
  OwnerBadge,
  CommentMeta,
  CommentDate,
  CommentDelBtn,
  LikeBtn,
  LikeCount,
  CommentBody,
  EmptyComment,
  CommentInputBox,
  CommentInputRow,
  CommentTextArea,
  CommentSubmitBtn,
  Overlay,
  LightboxImg,
  LightboxClose,
  LightboxPrev,
  LightboxNext,
  Modal,
  ModalText,
  ModalButtons,
  ModalCancel,
  ModalDelete,
  ModalOverlay,
  Empty,
  Pagination,
  PageBtn,
  Stars,
  Star,
  StayInfo,
} from '../styles/ReviewListPage.styles';

function StarDisplay({ rating }) {
  return (
    <Stars>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} $filled={n <= rating}>
          ★
        </Star>
      ))}
    </Stars>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return '오늘';
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}

/* ── 댓글 좋아요 버튼 ── */
function CommentLikeBtn({ reviewId, commentId }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCommentLike(reviewId, commentId)
      .then((data) => {
        setLiked(data.liked);
        setCount(data.count);
      })
      .catch(() => {});
  }, [commentId]);

  async function handleToggle() {
    if (loading) return;
    try {
      setLoading(true);
      const data = await toggleCommentLike(reviewId, commentId);
      setLiked(data.liked);
      setCount(data.count);
    } catch {
      alert('로그인이 필요합니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <LikeBtn $liked={liked} onClick={handleToggle} disabled={loading}>
      👍 {count > 0 && <LikeCount>{count}</LikeCount>}
    </LikeBtn>
  );
}

/* ── 댓글 섹션 ── */
function CommentSection({ reviewId }) {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoadingComments(true);
    getComments(reviewId)
      .then((data) =>
        setComments(Array.isArray(data) ? data : (data.content ?? []))
      )
      .catch((err) => console.error(err))
      .finally(() => setLoadingComments(false));
  }, [reviewId]);

  async function handleCommentSubmit() {
    if (!commentInput.trim()) return;
    try {
      setSubmitting(true);
      await createComment(reviewId, { content: commentInput, ownerYn: 'N' });
      const updated = await getComments(reviewId);
      setComments(Array.isArray(updated) ? updated : (updated.content ?? []));
      setCommentInput('');
    } catch (err) {
      console.error(err);
      alert('댓글 등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCommentDelete(commentId) {
    try {
      await deleteComment(reviewId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setDeleteCommentId(null);
    } catch (err) {
      console.error(err);
      alert('댓글 삭제에 실패했습니다.');
    }
  }

  if (loadingComments)
    return <CommentLoading>댓글 불러오는 중...</CommentLoading>;

  return (
    <CommentArea>
      <CommentList>
        {comments.length === 0 && (
          <EmptyComment>첫 번째 댓글을 남겨보세요</EmptyComment>
        )}
        {comments.map((c) => (
          <CommentCard key={c.id} $isOwner={c.ownerYn === 'Y'}>
            <CommentTop>
              <CommentAvatar $isOwner={c.ownerYn === 'Y'}>
                {c.writer?.charAt(0) ?? '?'}
              </CommentAvatar>
              <CommentWriter $isOwner={c.ownerYn === 'Y'}>
                {c.writer}
              </CommentWriter>
              {c.ownerYn === 'Y' && <OwnerBadge>운영자</OwnerBadge>}
              <CommentMeta>
                <CommentDate>{formatDate(c.createdAt)}</CommentDate>
                <CommentLikeBtn reviewId={reviewId} commentId={c.id} />
                <CommentDelBtn onClick={() => setDeleteCommentId(c.id)}>
                  삭제
                </CommentDelBtn>
              </CommentMeta>
            </CommentTop>
            <CommentBody>{c.content}</CommentBody>
          </CommentCard>
        ))}
      </CommentList>

      <CommentInputBox>
        <CommentInputRow>
          <CommentTextArea
            placeholder="댓글을 입력하세요"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCommentSubmit();
              }
            }}
          />
          <CommentSubmitBtn onClick={handleCommentSubmit} disabled={submitting}>
            {submitting ? '...' : '등록'}
          </CommentSubmitBtn>
        </CommentInputRow>
      </CommentInputBox>

      {deleteCommentId && (
        <ModalOverlay>
          <Modal>
            <ModalText>댓글을 삭제하시겠습니까?</ModalText>
            <ModalButtons>
              <ModalCancel onClick={() => setDeleteCommentId(null)}>
                취소
              </ModalCancel>
              <ModalDelete onClick={() => handleCommentDelete(deleteCommentId)}>
                삭제
              </ModalDelete>
            </ModalButtons>
          </Modal>
        </ModalOverlay>
      )}
    </CommentArea>
  );
}

/* ── 게시글 좋아요 버튼 ── */
function ReviewLikeBtn({ reviewId }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getReviewLike(reviewId)
      .then((data) => {
        setLiked(data.liked);
        setCount(data.count);
      })
      .catch(() => {});
  }, [reviewId]);

  async function handleToggle() {
    if (loading) return;
    try {
      setLoading(true);
      const data = await toggleReviewLike(reviewId);
      setLiked(data.liked);
      setCount(data.count);
    } catch {
      alert('로그인이 필요합니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ReviewLikeBtnWrapper
      $liked={liked}
      onClick={handleToggle}
      disabled={loading}
    >
      👍 좋아요 {count > 0 && <span>{count}</span>}
    </ReviewLikeBtnWrapper>
  );
}

/* ── 카드 ── */
function ReviewCard({ review, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [needsMore, setNeedsMore] = useState(false);
  const contentRef = useRef(null);
  const imageUrls = review.images?.map((img) => getImageUrl(img.s3Key)) ?? [];

  useEffect(() => {
    if (!contentRef.current) return;
    const lineHeight = parseFloat(
      getComputedStyle(contentRef.current).lineHeight
    );
    setNeedsMore(contentRef.current.scrollHeight > lineHeight * 3 + 4);
  }, [review.content]);

  return (
    <Card>
      <CardHeader>
        <Avatar>{review.writer?.[0] ?? 'U'}</Avatar>
        <HeaderRight>
          <TitleRow>
            <CardTitle>{review.title}</CardTitle>
            <CardActions>
              <ActionBtn onClick={() => onEdit(review.id)}>수정</ActionBtn>
              <ActionBtn $danger onClick={() => setShowConfirm(true)}>
                삭제
              </ActionBtn>
            </CardActions>
          </TitleRow>
          <WriterMeta>
            <WriterName>{review.writer}</WriterName>
            {review.stayName && <StayInfo>📍 {review.stayName}</StayInfo>}
            <StarDisplay rating={review.rating} />
            <ReviewLikeBtn reviewId={review.id} />
            <DateText>{formatDate(review.createdAt)}</DateText>
          </WriterMeta>
        </HeaderRight>
      </CardHeader>

      {imageUrls.length > 0 && (
        <ImageGrid>
          {imageUrls.slice(0, 4).map((src, i) => (
            <ImageItem key={i} onClick={() => setLightboxIdx(i)}>
              <img src={src} alt={`리뷰 이미지 ${i + 1}`} />
              {i === 3 && imageUrls.length > 4 && (
                <MoreImageOverlay>+{imageUrls.length - 4}</MoreImageOverlay>
              )}
            </ImageItem>
          ))}
        </ImageGrid>
      )}

      <ContentArea>
        <CardContent ref={contentRef} $expanded={expanded}>
          {review.content}
        </CardContent>
        {needsMore && (
          <MoreBtn onClick={() => setExpanded((v) => !v)}>
            {expanded ? '접기 ▲' : '더보기 ▼'}
          </MoreBtn>
        )}
      </ContentArea>

      <CommentToggleBtn onClick={() => setShowComments((v) => !v)}>
        💬 댓글 {showComments ? '닫기 ▲' : '보기 ▼'}
      </CommentToggleBtn>

      {showComments && <CommentSection reviewId={review.id} />}

      {lightboxIdx !== null && (
        <Overlay onClick={() => setLightboxIdx(null)}>
          <LightboxImg
            src={imageUrls[lightboxIdx]}
            alt="확대"
            onClick={(e) => e.stopPropagation()}
          />
          <LightboxClose onClick={() => setLightboxIdx(null)}>✕</LightboxClose>
          {lightboxIdx > 0 && (
            <LightboxPrev
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx(lightboxIdx - 1);
              }}
            >
              ‹
            </LightboxPrev>
          )}
          {lightboxIdx < imageUrls.length - 1 && (
            <LightboxNext
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx(lightboxIdx + 1);
              }}
            >
              ›
            </LightboxNext>
          )}
        </Overlay>
      )}

      {showConfirm && (
        <Overlay onClick={() => setShowConfirm(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalText>정말 삭제하시겠습니까?</ModalText>
            <ModalButtons>
              <ModalCancel onClick={() => setShowConfirm(false)}>
                취소
              </ModalCancel>
              <ModalDelete
                onClick={() => {
                  setShowConfirm(false);
                  onDelete(review.id);
                }}
              >
                삭제
              </ModalDelete>
            </ModalButtons>
          </Modal>
        </Overlay>
      )}
    </Card>
  );
}

/* ── 메인 ── */
export default function ReviewListPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const topRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    getReviewList(currentPage)
      .then((data) => {
        setList(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [currentPage]);

  function handlePageChange(page) {
    setCurrentPage(page);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleDelete(id) {
    try {
      await deleteReview(id);
      const data = await getReviewList(currentPage);
      setList(data.content ?? []);
      setTotalPages(data.totalPages ?? 1);
      if ((data.content ?? []).length === 0 && currentPage > 0)
        setCurrentPage((p) => p - 1);
    } catch (err) {
      console.error(err);
      alert('삭제에 실패했습니다.');
    }
  }

  if (loading) return <Empty>불러오는 중...</Empty>;

  return (
    <Wrapper>
      <div ref={topRef} />
      <ListHeader>
        <ReviewCount>
          ⭐ 전체 후기 <Strong>{totalPages * 10}개+</Strong>
        </ReviewCount>
      </ListHeader>
      <FeedList>
        {list.length === 0 && <Empty>등록된 후기가 없습니다.</Empty>}
        {list.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onDelete={handleDelete}
            onEdit={(id) => navigate(`/review/edit/${id}`)}
          />
        ))}
      </FeedList>
      {totalPages > 1 && (
        <Pagination>
          <PageBtn
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            ‹
          </PageBtn>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageBtn
              key={i}
              $active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </PageBtn>
          ))}
          <PageBtn
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            ›
          </PageBtn>
        </Pagination>
      )}
    </Wrapper>
  );
}
