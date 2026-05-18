package com.kh.app.transaction.payment.dto.response;

import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.payment.enums.PaymentMethod;
import com.kh.app.transaction.payment.enums.PaymentStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PaymentResDto {

    private Long paymentId;

    private Long reservationId;

    private PaymentMethod paymentMethod;

    private Long paymentAmount;

    private PaymentStatus paymentStatus;

    private String pgProvider;

    private String pgTid;

    private LocalDateTime paidAt;

    private LocalDateTime createdAt;

    public static PaymentResDto from(
            PaymentEntity payment
    ) {

        return PaymentResDto.builder()
                .paymentId(payment.getId())
                .reservationId(payment.getReservation().getId())
                .paymentMethod(payment.getPaymentMethod())
                .paymentAmount(payment.getPaymentAmount())
                .paymentStatus(payment.getPaymentStatus())
                .pgProvider(payment.getPgProvider())
                .pgTid(payment.getPgTid())
                .paidAt(payment.getPaidAt())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}