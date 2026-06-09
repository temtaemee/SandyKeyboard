package com.kh.app.transaction.payment.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentCreateReqDto {

    // 예약 번호
    private Long reservationNo;

    // 주문 번호
    private String orderId;

    // 결제 금액
    private Long amount;
}