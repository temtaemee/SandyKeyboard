package com.kh.app.transaction.refund.repository;

import com.kh.app.transaction.refund.entity.RefundEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefundRepository extends JpaRepository<RefundEntity, Long> {

    boolean existsByReservationId(Long reservationId);

    // 💡 1. 일반 유저용: 본인이 요청한 환불 내역 목록 조회
    @Query("SELECT r FROM RefundEntity r " +
            "JOIN FETCH r.reservation res " +
            "JOIN FETCH res.stay s " +
            "WHERE res.member.username = :username ORDER BY r.id DESC")
    List<RefundEntity> findMyRefunds(@Param("username") String username);

    // 💡 2. 관리자용: 전체 환불 내역 페이징 조회
    @Query(value = "SELECT r FROM RefundEntity r JOIN FETCH r.reservation res JOIN FETCH res.stay s",
            countQuery = "SELECT count(r) FROM RefundEntity r")
    Page<RefundEntity> findAllAdminRefunds(Pageable pageable);

    // 💡 3. 판매자용: 본인 소유의 숙소에 들어온 환불 내역 페이징 조회
    @Query(value = "SELECT r FROM RefundEntity r " +
            "JOIN FETCH r.reservation res " +
            "JOIN FETCH res.stay s " +
            "JOIN s.space sp " +
            "WHERE sp.seller.username = :sellerUsername",
            countQuery = "SELECT count(r) FROM RefundEntity r JOIN r.reservation res JOIN res.stay s JOIN s.space sp WHERE sp.seller.username = :sellerUsername")
    Page<RefundEntity> findSellerRefunds(@Param("sellerUsername") String sellerUsername, Pageable pageable);

    // 단건 페치조인 상세조회 (성능 최적화)
    @Query("SELECT r FROM RefundEntity r " +
            "JOIN FETCH r.reservation res " +
            "JOIN FETCH res.stay s " +
            "WHERE r.id = :id")
    Optional<RefundEntity> findDetailById(@Param("id") Long id);
}