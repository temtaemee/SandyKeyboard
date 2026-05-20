package com.kh.app.transaction.payment.dto.request;

import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.payment.enums.PaymentMethod;
import com.kh.app.transaction.payment.enums.PaymentStatus;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentCreateReqDto {

    private Long reservationId;

    private PaymentMethod paymentMethod;

    private Long amount;

    private String pgProvider;


    public PaymentEntity toEntity(
            ReservationEntity reservation
    ) {

        return PaymentEntity.builder()
                .reservation(reservation)
                .paymentMethod(paymentMethod)
                .paymentAmount(amount)
                .paymentStatus(PaymentStatus.PENDING)
                .pgProvider(pgProvider)
                .build();
    }
}