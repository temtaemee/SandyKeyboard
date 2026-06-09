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

    private Long amount;

    private PaymentStatus status;

    private String orderId;

    private String paymentKey;

    private LocalDateTime approvedAt;

    private LocalDateTime createdAt;

    public static PaymentResDto from(
            PaymentEntity payment
    ) {

        return PaymentResDto.builder()
                .paymentId(payment.getId())
                .reservationId(payment.getReservation().getId())
                .paymentMethod(payment.getPaymentMethod())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .orderId(payment.getOrderId())
                .paymentKey(payment.getPaymentKey())
                .approvedAt(payment.getApprovedAt())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}