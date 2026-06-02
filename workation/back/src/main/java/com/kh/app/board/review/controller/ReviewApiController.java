package com.kh.app.board.review.controller;

import com.kh.app.board.review.dto.request.CommentCreateReqDto;
import com.kh.app.board.review.dto.request.ReviewCreateReqDto;
import com.kh.app.board.review.dto.request.ReviewUpdateReqDto;
import com.kh.app.board.review.dto.response.CommentRespDto;
import com.kh.app.board.review.dto.response.ReviewListRespDto;
import com.kh.app.board.review.dto.response.ReviewRespDto;
import com.kh.app.board.review.service.ReviewService;
import com.kh.app.security.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class ReviewApiController {

    private final ReviewService reviewService;

    // 전체 목록 조회
    @GetMapping("/api/public/reviews")
    public ResponseEntity<Page<ReviewListRespDto>> findAll(
            @RequestParam(defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(reviewService.findAll(page));
    }

    // 상세 조회
    @GetMapping("/api/public/reviews/{id}")
    public ResponseEntity<ReviewRespDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.findById(id));
    }

    // 댓글 목록 조회
    @GetMapping("/api/public/reviews/{id}/comments")
    public ResponseEntity<List<CommentRespDto>> findComments(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.findComments(id));
    }

    // 내 리뷰 목록
    @GetMapping("/api/user/reviews/my")
    public ResponseEntity<Page<ReviewListRespDto>> findMyReview(
            @RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long memberId = userDetails.getUserVo().getId();
        return ResponseEntity.ok(reviewService.findMyReview(memberId, page));
    }

    // 리뷰 등록
    @PostMapping("/api/user/reviews")
    public ResponseEntity<Long> create(
            @RequestPart("dto") ReviewCreateReqDto dto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long memberId = userDetails.getUserVo().getId();
        Long id = reviewService.create(dto, images, memberId);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

    // 리뷰 수정
    @PutMapping("/api/user/reviews/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @RequestPart("dto") ReviewUpdateReqDto dto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "deletedImageIds", required = false) List<Long> deletedImageIds,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        reviewService.update(id, dto, images, deletedImageIds);
        return ResponseEntity.ok().build();
    }

    // 리뷰 삭제
    @DeleteMapping("/api/user/reviews/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        reviewService.delete(id);
        return ResponseEntity.ok().build();
    }

    // 댓글 등록
    @PostMapping("/api/user/reviews/{id}/comments")
    public ResponseEntity<Long> createComment(
            @PathVariable Long id,
            @RequestBody CommentCreateReqDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long memberId = userDetails.getUserVo().getId();
        Long commentId = reviewService.createComment(id, dto, memberId);
        return ResponseEntity.status(HttpStatus.CREATED).body(commentId);
    }

    // 댓글 삭제
    @DeleteMapping("/api/user/reviews/{id}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        reviewService.deleteComment(commentId);
        return ResponseEntity.ok().build();
    }

    // ─────────────────────────────────────────
    // SELLER 전용
    // ─────────────────────────────────────────

    // 본인 숙소 리뷰 목록 조회
// GET /api/seller/reviews?page=0
    @GetMapping("/api/seller/reviews")
    public ResponseEntity<Page<ReviewListRespDto>> findReviewsBySeller(
            @RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long memberId = userDetails.getUserVo().getId();
        return ResponseEntity.ok(reviewService.findReviewsBySeller(memberId, page));
    }

    // 본인 숙소 리뷰 수정
// PUT /api/seller/reviews/{id}
    @PutMapping("/api/seller/reviews/{id}")
    public ResponseEntity<Void> updateBySeller(
            @PathVariable Long id,
            @RequestBody ReviewUpdateReqDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long memberId = userDetails.getUserVo().getId();
        reviewService.updateBySeller(id, dto, memberId);
        return ResponseEntity.ok().build();
    }
}