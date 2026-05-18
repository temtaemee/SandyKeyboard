package com.kh.app.transaction.payment.repository;

import com.kh.app.transaction.payment.entity.PaymentCardEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentCardRepository
        extends JpaRepository<PaymentCardEntity, Long> {
}