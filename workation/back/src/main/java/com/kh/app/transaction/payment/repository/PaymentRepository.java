package com.kh.app.transaction.payment.repository;

import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository
        extends JpaRepository<PaymentEntity, Long>,
        PaymentRepositoryCustom {

    boolean existsByPaymentKey(String paymentKey);

    // 예약 엔티티를 조건으로 결제 원장 한 건을 안전하게 찾아오는 쿼리 메서드
    Optional<PaymentEntity> findByReservation(ReservationEntity reservation);

}