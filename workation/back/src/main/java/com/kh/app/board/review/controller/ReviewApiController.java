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

    // ─────────────────────────────────────────
    // 공개 조회 API
    // ─────────────────────────────────────────

    // 전체 목록 조회  GET /api/public/board/review?page=0
    @GetMapping("/api/public/board/review")
    public ResponseEntity<Page<ReviewListRespDto>> findAll(
            @RequestParam(defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(reviewService.findAll(page));
    }

    // 상세 조회  GET /api/public/board/review/{id}
    @GetMapping("/api/public/board/review/{id}")
    public ResponseEntity<ReviewRespDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.findById(id));
    }

    // 댓글 목록  GET /api/public/board/review/{id}/comment
    @GetMapping("/api/public/board/review/{id}/comment")
    public ResponseEntity<List<CommentRespDto>> findComments(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.findComments(id));
    }

    // ─────────────────────────────────────────
    // 로그인 필요 API
    // ─────────────────────────────────────────

    // 내 리뷰 목록  GET /api/user/board/review/my?page=0
    @GetMapping("/api/user/board/review/my")
    public ResponseEntity<Page<ReviewListRespDto>> findMyReview(
            @RequestParam(defaultValue = "0") int page,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long memberId = userDetails.getUserVo().getId();
        return ResponseEntity.ok(reviewService.findMyReview(memberId, page));
    }

    // 등록  POST /api/user/board/review
    @PostMapping("/api/user/board/review")
    public ResponseEntity<Long> create(
            @RequestPart("dto") ReviewCreateReqDto dto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long memberId = userDetails.getUserVo().getId();
        Long id = reviewService.create(dto, images, memberId);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

    // 수정  PUT /api/user/board/review/{id}
    @PutMapping("/api/user/board/review/{id}")
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

    // 삭제  DELETE /api/user/board/review/{id}
    @DeleteMapping("/api/user/board/review/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        reviewService.delete(id);
        return ResponseEntity.ok().build();
    }

    // 댓글 등록  POST /api/user/board/review/{id}/comment
    @PostMapping("/api/user/board/review/{id}/comment")
    public ResponseEntity<Long> createComment(
            @PathVariable Long id,
            @RequestBody CommentCreateReqDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long memberId = userDetails.getUserVo().getId();
        Long commentId = reviewService.createComment(id, dto, memberId);
        return ResponseEntity.status(HttpStatus.CREATED).body(commentId);
    }

    // 댓글 삭제  DELETE /api/user/board/review/{id}/comment/{commentId}
    @DeleteMapping("/api/user/board/review/{id}/comment/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @PathVariable Long commentId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        reviewService.deleteComment(commentId);
        return ResponseEntity.ok().build();
    }
}