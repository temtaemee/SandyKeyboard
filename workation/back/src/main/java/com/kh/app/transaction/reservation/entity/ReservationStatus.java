package com.kh.app.transaction.reservation.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReservationStatus {

    // 예약 생성
    PENDING("예약 대기"),

    // 결제 완료
    PAYMENT_COMPLETED("결제 완료"),

    // 판매자 승인
    RESERVED("예약 확정"),

    // 사용자 취소
    USER_CANCELLED("사용자 취소"),

    // 판매자 취소
    SELLER_CANCELLED("판매자 취소"),

    // 환불 완료
    REFUND_COMPLETED("환불 완료"),

    // 이용 완료
    COMPLETED("이용 완료");

    private final String label;
}