package com.kh.app.transaction.payment.repository;

import com.kh.app.transaction.payment.entity.PaymentEntity;

import java.util.List;

public interface PaymentRepositoryCustom {

    List<PaymentEntity> findPaymentListByReservationNo(Long reservationNo);
}