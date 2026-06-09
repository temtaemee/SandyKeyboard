package com.kh.app.board.review.controller;

import com.kh.app.board.review.dto.response.LikeRespDto;
import com.kh.app.board.review.service.LikeService;
import com.kh.app.security.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class LikeApiController {

    private final LikeService likeService;

    // 게시글 좋아요 토글
    @PostMapping("/api/user/reviews/{reviewId}/like")
    public ResponseEntity<LikeRespDto> toggleReviewLike(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        Long memberId = userDetails.getUserVo().getId();

        return ResponseEntity.ok(
                likeService.toggleReviewLike(reviewId, memberId)
        );
    }

    // 게시글 좋아요 조회
    @GetMapping("/api/public/reviews/{reviewId}/like")
    public ResponseEntity<LikeRespDto> getReviewLike(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        Long memberId = userDetails == null
                ? null
                : userDetails.getUserVo().getId();

        return ResponseEntity.ok(
                likeService.getReviewLike(reviewId, memberId)
        );
    }

    // 댓글 좋아요 토글
    @PostMapping("/api/user/reviews/{reviewId}/comments/{commentId}/like")
    public ResponseEntity<LikeRespDto> toggleCommentLike(
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        Long memberId = userDetails.getUserVo().getId();

        return ResponseEntity.ok(
                likeService.toggleCommentLike(commentId, memberId)
        );
    }

    // 댓글 좋아요 조회
    @GetMapping("/api/public/reviews/{reviewId}/comments/{commentId}/like")
    public ResponseEntity<LikeRespDto> getCommentLike(
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        Long memberId = userDetails == null
                ? null
                : userDetails.getUserVo().getId();

        return ResponseEntity.ok(
                likeService.getCommentLike(commentId, memberId)
        );
    }
}