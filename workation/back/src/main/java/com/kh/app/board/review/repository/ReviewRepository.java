package com.kh.app.board.review.repository;

import com.kh.app.board.review.entity.ReviewEntity;
import com.kh.app.member.entity.MemberEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

    // 전체 목록 (최신순 페이징)
    Page<ReviewEntity> findAllByDelYnOrderByCreatedAtDesc(String delYn, Pageable pageable);

    // 내 리뷰 목록 (최신순 페이징)
    Page<ReviewEntity> findAllByMemberAndDelYnOrderByCreatedAtDesc(MemberEntity member, String delYn, Pageable pageable);

    Optional<ReviewEntity> findByIdAndDelYn(Long id, String delYn);
}