package com.kh.app.transaction.payment.repository;

import com.kh.app.transaction.payment.entity.PaymentLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentLogRepository
        extends JpaRepository<PaymentLogEntity, Long> {
}