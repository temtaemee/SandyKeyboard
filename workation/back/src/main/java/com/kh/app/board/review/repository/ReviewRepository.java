package com.kh.app.board.review.repository;

import com.kh.app.board.review.entity.ReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

    // 페이징 목록 조회 (delYn = 'N' 인 것만, 최신순)
    Page<ReviewEntity> findAllByDelYnOrderByCreatedAtDesc(String delYn, Pageable pageable);

    Optional<ReviewEntity> findByIdAndDelYn(Long id, String delYn);
}