package com.kh.app.board.review.repository;

import com.kh.app.board.review.entity.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    List<CommentEntity> findAllByReviewIdAndDelYnOrderByCreatedAtAsc(Long reviewId, String delYn);

    Optional<CommentEntity> findByIdAndDelYn(Long id, String delYn);
}