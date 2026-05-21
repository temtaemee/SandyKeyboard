package com.kh.app.transaction.payment.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentConfirmReqDto {

    private String paymentKey;

    private String orderId;

    private Long amount;

    private Long reservationId;
}