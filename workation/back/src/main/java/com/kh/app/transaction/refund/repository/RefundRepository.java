package com.kh.app.transaction.refund.repository;

import com.kh.app.transaction.refund.entity.RefundEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefundRepository extends JpaRepository<RefundEntity, Long> {
    // 추후 특정 예약 번호로 환불 내역을 찾을 때를 대비한 쿼리 메소드
    boolean existsByReservationId(Long reservationId);
}