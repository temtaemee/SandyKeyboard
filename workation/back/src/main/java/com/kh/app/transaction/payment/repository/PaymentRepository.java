package com.kh.app.transaction.payment.repository;

import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository
        extends JpaRepository<PaymentEntity, Long>,
        PaymentRepositoryCustom {

    boolean existsByPaymentKey(String paymentKey);


}