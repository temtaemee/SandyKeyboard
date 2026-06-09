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
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import com.kh.app.transaction.reservation.repository.ReservationRepository;
import com.kh.app.product.space.repository.SpacePictureRepository;
import com.kh.app.transaction.reservation.dto.response.ReservationResDto;
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
    private final ReservationRepository reservationRepository; // 추가
    private final SpacePictureRepository spacePictureRepository;
    private final S3Service s3Service;

    // 전체 목록 조회 - 일반 사용자용 (숨긴 리뷰 제외)
    @Transactional(readOnly = true)
    public Page<ReviewListRespDto> findAll(int page) {
        Pageable pageable = PageRequest.of(page, 10);
        return reviewRepository.findAllByDelYnAndHideYnOrderByCreatedAtDesc("N", "N", pageable)
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

    // 등록 - 예약 검증 추가
    public Long create(ReviewCreateReqDto dto, List<MultipartFile> images, Long memberId) {
        MemberEntity member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        // 1. 예약 존재 여부 확인
        ReservationEntity reservation = reservationRepository.findById(dto.getReservationId())
                .orElseThrow(() -> new IllegalArgumentException("예약 내역을 찾을 수 없습니다."));

        // 2. 본인 예약인지 확인
        if (!reservation.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException("본인의 예약 건에만 리뷰를 작성할 수 있습니다.");
        }

        // 3. 이용 완료 상태인지 확인
        if (reservation.getStatus() != ReservationStatus.COMPLETED) {
            throw new IllegalArgumentException("이용 완료된 예약 건에만 리뷰를 작성할 수 있습니다.");
        }

        // 4. 이미 리뷰가 작성된 예약인지 확인
        if (reviewRepository.existsByReservationId(dto.getReservationId())) {
            throw new IllegalArgumentException("이미 리뷰가 작성된 예약입니다.");
        }

        ReviewEntity review = dto.toEntity(member, reservation);
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
    public void update(Long id, ReviewUpdateReqDto dto, List<MultipartFile> images, List<Long> deletedImageIds, Long memberId) {
        ReviewEntity review = reviewRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));

        if (!review.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException("본인의 후기만 수정할 수 있습니다.");
        }

        review.update(dto.getTitle(), dto.getContent(), dto.getTag(), dto.getRating());

        if (deletedImageIds != null && !deletedImageIds.isEmpty()) {
            deletedImageIds.forEach(imageId ->
                    reviewImageRepository.findById(imageId)
                            .ifPresent(ReviewImageEntity::delete)
            );
        }

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
    public void delete(Long id, Long memberId) {
        ReviewEntity review = reviewRepository.findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));

        if (!review.getMember().getId().equals(memberId)) {
            throw new IllegalArgumentException("본인의 후기만 삭제할 수 있습니다.");
        }

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

    @Transactional(readOnly = true)
    public List<ReservationResDto> findUnreviewedReservations(Long memberId) {
        return reservationRepository.findUnreviewedReservations(memberId)
                .stream()
                .map(reservation -> {
                    String imageUrl = null;
                    if (reservation.getStay() != null && reservation.getStay().getSpace() != null) {
                        imageUrl = spacePictureRepository.findBySpaceIdAndMainYn(reservation.getStay().getSpace().getId(), "Y")
                                .map(p -> p.getFilePath().startsWith("http") ? p.getFilePath() : s3Service.getFileUrl(p.getFilePath()))
                                .orElse(null);
                    }
                    return ReservationResDto.from(reservation, imageUrl);
                })
                .toList();
    }

    // ReviewService에 추가할 메서드들

    // seller용 - 본인 숙소 리뷰 목록 조회
    @Transactional(readOnly = true)
    public Page<ReviewListRespDto> findReviewsBySeller(Long memberId, int page) {
        Pageable pageable = PageRequest.of(page, 10);
        return reviewRepository.findAllBySeller(memberId, pageable)
                .map(review -> {
                    List<ReviewImageEntity> images =
                            reviewImageRepository.findAllByReviewIdAndDelYn(review.getId(), "N");
                    return ReviewListRespDto.from(review, images);
                });
    }

    // seller용 - 본인 숙소 리뷰만 수정
    public void updateBySeller(Long reviewId, ReviewUpdateReqDto dto, Long memberId) {
        ReviewEntity review = reviewRepository.findByIdAndDelYn(reviewId, "N")
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));

        Long stayOwnerId = review.getReservation().getStay().getSpace().getSeller().getId();

        if (!stayOwnerId.equals(memberId)) {
            throw new IllegalArgumentException("본인 숙소의 리뷰만 수정할 수 있습니다.");
        }

        review.update(dto.getTitle(), dto.getContent(), dto.getTag(), dto.getRating());
    }
    // ─────────────────────────────────────────
    // 댓글 숨김 (admin 전용)
    // ─────────────────────────────────────────

    // 댓글 숨김 처리
    public void hideComment(Long commentId) {
        CommentEntity comment = commentRepository.findByIdAndDelYn(commentId, "N")
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        comment.hide();
    }

    // 댓글 숨김 해제
    public void showComment(Long commentId) {
        CommentEntity comment = commentRepository.findByIdAndDelYn(commentId, "N")
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        comment.show();
    }

    // ─────────────────────────────────────────
// 리뷰 숨김 (admin 전용)
// ─────────────────────────────────────────

    // 리뷰 숨김 처리
    public void hideReview(Long reviewId) {
        ReviewEntity review = reviewRepository.findByIdAndDelYn(reviewId, "N")
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));
        review.hide();
    }

    // 리뷰 숨김 해제
    public void showReview(Long reviewId) {
        ReviewEntity review = reviewRepository.findByIdAndDelYn(reviewId, "N")
                .orElseThrow(() -> new IllegalArgumentException("후기를 찾을 수 없습니다."));
        review.show();
    }
    // 전체 목록 조회 - 관리자용 (숨긴 리뷰 포함)
    @Transactional(readOnly = true)
    public Page<ReviewListRespDto> findAllForAdmin(int page) {
        Pageable pageable = PageRequest.of(page, 10);
        return reviewRepository.findAllByDelYnOrderByCreatedAtDesc("N", pageable)
                .map(review -> {
                    List<ReviewImageEntity> images =
                            reviewImageRepository.findAllByReviewIdAndDelYn(review.getId(), "N");
                    return ReviewListRespDto.from(review, images);
                });
    }

}

