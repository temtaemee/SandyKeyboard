package com.kh.app.board.review.service;

import com.kh.app.board.review.dto.response.LikeRespDto;
import com.kh.app.board.review.entity.CommentLikeEntity;
import com.kh.app.board.review.entity.ReviewLikeEntity;
import com.kh.app.board.review.repository.CommentLikeRepository;
import com.kh.app.board.review.repository.CommentRepository;
import com.kh.app.board.review.repository.ReviewLikeRepository;
import com.kh.app.board.review.repository.ReviewRepository;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeService {

    private final ReviewLikeRepository reviewLikeRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;

    // ── 게시글 좋아요 토글 ──────────────────────────────

    public LikeRespDto toggleReviewLike(Long reviewId, Long memberId) {
        MemberEntity member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("member not found"));

        boolean alreadyLiked = reviewLikeRepository.existsByReviewIdAndMemberId(reviewId, memberId);

        if (alreadyLiked) {
            // 이미 좋아요 → 취소
            reviewLikeRepository.findByReviewIdAndMemberId(reviewId, memberId)
                    .ifPresent(reviewLikeRepository::delete);
        } else {
            // 좋아요 추가
            var review = reviewRepository.findByIdAndDelYn(reviewId, "N")
                    .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));
            reviewLikeRepository.save(
                    ReviewLikeEntity.builder()
                            .review(review)
                            .member(member)
                            .build()
            );
        }

        long count = reviewLikeRepository.countByReviewId(reviewId);
        return new LikeRespDto(!alreadyLiked, count);
    }

    // ── 게시글 좋아요 조회 ──────────────────────────────

    @Transactional(readOnly = true)
    public LikeRespDto getReviewLike(Long reviewId, Long memberId) {
        boolean liked = memberId != null &&
                reviewLikeRepository.existsByReviewIdAndMemberId(reviewId, memberId);
        long count = reviewLikeRepository.countByReviewId(reviewId);
        return new LikeRespDto(liked, count);
    }

    // ── 댓글 좋아요 토글 ──────────────────────────────

    public LikeRespDto toggleCommentLike(Long commentId, Long memberId) {
        MemberEntity member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("member not found"));

        boolean alreadyLiked = commentLikeRepository.existsByCommentIdAndMemberId(commentId, memberId);

        if (alreadyLiked) {
            commentLikeRepository.findByCommentIdAndMemberId(commentId, memberId)
                    .ifPresent(commentLikeRepository::delete);
        } else {
            var comment = commentRepository.findByIdAndDelYn(commentId, "N")
                    .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
            commentLikeRepository.save(
                    CommentLikeEntity.builder()
                            .comment(comment)
                            .member(member)
                            .build()
            );
        }

        long count = commentLikeRepository.countByCommentId(commentId);
        return new LikeRespDto(!alreadyLiked, count);
    }

    // ── 댓글 좋아요 조회 ──────────────────────────────

    @Transactional(readOnly = true)
    public LikeRespDto getCommentLike(Long commentId, Long memberId) {
        boolean liked = memberId != null &&
                commentLikeRepository.existsByCommentIdAndMemberId(commentId, memberId);
        long count = commentLikeRepository.countByCommentId(commentId);
        return new LikeRespDto(liked, count);
    }
}