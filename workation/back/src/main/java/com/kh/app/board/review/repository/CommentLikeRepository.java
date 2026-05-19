package com.kh.app.board.review.repository;

import com.kh.app.board.review.entity.CommentLikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommentLikeRepository extends JpaRepository<CommentLikeEntity, Long> {

    boolean existsByCommentIdAndMemberId(Long commentId, Long memberId);

    Optional<CommentLikeEntity> findByCommentIdAndMemberId(Long commentId, Long memberId);

    long countByCommentId(Long commentId);
}