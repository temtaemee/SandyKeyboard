package com.kh.app.board.review.repository;

import com.kh.app.board.review.entity.ReviewImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewImageRepository extends JpaRepository<ReviewImageEntity, Long> {

    List<ReviewImageEntity> findAllByReviewIdAndDelYn(Long reviewId, String delYn);
}