package com.kh.app.board.review.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.board.review.dto.request.CommentCreateReqDto;
import com.kh.app.board.review.dto.request.ReviewCreateReqDto;
import com.kh.app.board.review.dto.request.ReviewUpdateReqDto;
import com.kh.app.board.review.dto.response.CommentRespDto;
import com.kh.app.board.review.dto.response.ReviewListRespDto;
import com.kh.app.board.review.dto.response.ReviewRespDto;
import com.kh.app.board.review.entity.CommentEntity;
import com.kh.app.board.review.entity.ReviewEntity;
import com.kh.app.board.review.entity.ReviewImageEntity;
import com.kh.app.board.review.repository.CommentRepository;
import com.kh.app.board.review.repository.ReviewImageRepository;
import com.kh.app.board.review.repository.ReviewRepository;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;
    private final S3Service s3Service;

    // 전체 목록 조회 (페이징)
    @Transactional(readOnly = true)
    public Page<ReviewListRespDto> findAll(int page) {
        Pageable pageable = PageRequest.of(page, 10);
        return reviewRepository.findAllByDelYnOrderByCreatedAtDesc("N", pageable)
                .map(review -> {
                    List<ReviewImageEntity> images =
                            reviewImageRepository.findAllByReviewIdAndDelYn(review.getId(), "N");
                    return ReviewListRespDto.from(review, images);
                });
    }

    // 내 리뷰 목록 조회 (페이징)
    @Transactional(readOnly = true)
    public Page<ReviewListRespDto> findMyReview(Long memberId, int page) {
        MemberEntity member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        Pageable pageable = PageRequest.of(page, 10);
        return reviewRepository.findAllByMemberAndDelYnOrderByCreatedAtDesc(member, "N", pageable)
                .map(review -> {
                    List<ReviewImageEntity> images =
                            reviewImageRepository.findAllByReviewIdAndDelYn(review.getId(), "N");
                    return ReviewListRespDto.from(review, images);
                });
    }

    // 상세 조회
    @Transactional(readOnly = true)
    public ReviewRespDto findById(Long id) {
        ReviewEntity review = reviewRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));
        List<ReviewImageEntity> images = reviewImageRepository.findAllByReviewIdAndDelYn(id, "N");
        return ReviewRespDto.from(review, images);
    }

    // 등록
    public Long create(ReviewCreateReqDto dto, List<MultipartFile> images, Long memberId) {
        MemberEntity member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("member not found"));

        ReviewEntity review = dto.toEntity(member);
        reviewRepository.save(review);

        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                try {
                    String s3Key = s3Service.upload(image, "review");
                    ReviewImageEntity reviewImage = ReviewImageEntity.builder()
                            .review(review)
                            .originalFileName(image.getOriginalFilename())
                            .s3Key(s3Key)
                            .build();
                    reviewImageRepository.save(reviewImage);
                } catch (IOException e) {
                    throw new RuntimeException("이미지 업로드에 실패했습니다.", e);
                }
            }
        }
        return review.getId();
    }

    // 수정
    public void update(Long id, ReviewUpdateReqDto dto, List<MultipartFile> images, List<Long> deletedImageIds) {
        ReviewEntity review = reviewRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));
        review.update(dto.getTitle(), dto.getContent(), dto.getTag(), dto.getRating());

        // 삭제 요청된 기존 이미지 소프트 삭제
        if (deletedImageIds != null && !deletedImageIds.isEmpty()) {
            deletedImageIds.forEach(imageId ->
                    reviewImageRepository.findById(imageId)
                            .ifPresent(ReviewImageEntity::delete)
            );
        }

        // 새 이미지 추가
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                try {
                    String s3Key = s3Service.upload(image, "review");
                    ReviewImageEntity reviewImage = ReviewImageEntity.builder()
                            .review(review)
                            .originalFileName(image.getOriginalFilename())
                            .s3Key(s3Key)
                            .build();
                    reviewImageRepository.save(reviewImage);
                } catch (IOException e) {
                    throw new RuntimeException("이미지 업로드에 실패했습니다.", e);
                }
            }
        }
    }

    // 삭제
    public void delete(Long id) {
        ReviewEntity review = reviewRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));
        review.delete();
    }

    // 댓글 목록
    @Transactional(readOnly = true)
    public List<CommentRespDto> findComments(Long reviewId) {
        return commentRepository.findAllByReviewIdAndDelYnOrderByCreatedAtAsc(reviewId, "N")
                .stream().map(CommentRespDto::from).toList();
    }

    // 댓글 등록
    public Long createComment(Long reviewId, CommentCreateReqDto dto, Long memberId) {
        ReviewEntity review = reviewRepository.findByIdAndDelYn(reviewId, "N")
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));
        MemberEntity member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("member not found"));
        CommentEntity comment = dto.toEntity(review, member);
        commentRepository.save(comment);
        return comment.getId();
    }

    // 댓글 삭제
    public void deleteComment(Long commentId) {
        CommentEntity comment = commentRepository.findByIdAndDelYn(commentId, "N")
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        comment.delete();
    }
}