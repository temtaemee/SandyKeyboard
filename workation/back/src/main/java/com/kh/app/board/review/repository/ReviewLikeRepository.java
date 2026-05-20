package com.kh.app.board.review.repository;

import com.kh.app.board.review.entity.ReviewLikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewLikeRepository extends JpaRepository<ReviewLikeEntity, Long> {

    boolean existsByReviewIdAndMemberId(Long reviewId, Long memberId);

    Optional<ReviewLikeEntity> findByReviewIdAndMemberId(Long reviewId, Long memberId);

    long countByReviewId(Long reviewId);
}