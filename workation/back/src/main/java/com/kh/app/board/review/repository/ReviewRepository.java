package com.kh.app.board.review.repository;

import com.kh.app.board.review.entity.ReviewEntity;
import com.kh.app.member.entity.MemberEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

    // 전체 목록 (최신순 페이징)
    Page<ReviewEntity> findAllByDelYnOrderByCreatedAtDesc(String delYn, Pageable pageable);

    // 내 리뷰 목록 (최신순 페이징)
    Page<ReviewEntity> findAllByMemberAndDelYnOrderByCreatedAtDesc(MemberEntity member, String delYn, Pageable pageable);

    Optional<ReviewEntity> findByIdAndDelYn(Long id, String delYn);



    // seller의 숙소에 달린 리뷰 조회
    @Query("SELECT r FROM ReviewEntity r " +
            "WHERE r.reservation.stay.space.seller.id = :memberId " +
            "AND r.delYn = 'N' " +
            "ORDER BY r.createdAt DESC")
    Page<ReviewEntity> findAllBySeller(@Param("memberId") Long memberId, Pageable pageable);

    // 해당 예약으로 작성된 리뷰가 이미 있는지 확인
    boolean existsByReservationId(Long reservationId);


    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM ReviewEntity r WHERE r.space.id = :spaceId")
    List<Double> findAverageRatingBySpaceId(@Param("spaceId") Long spaceId);
}