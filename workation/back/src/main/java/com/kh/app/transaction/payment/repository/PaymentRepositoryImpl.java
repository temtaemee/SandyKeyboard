package com.kh.app.transaction.payment.repository;

import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.payment.entity.QPaymentEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class PaymentRepositoryImpl
        implements PaymentRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<PaymentEntity> findPaymentListByReservationNo(Long reservationNo) {

        QPaymentEntity payment = QPaymentEntity.paymentEntity;

        return queryFactory
                .selectFrom(payment)
                .where(payment.reservation.id.eq(reservationNo))
                .orderBy(payment.id.desc())
                .fetch();
    }
}