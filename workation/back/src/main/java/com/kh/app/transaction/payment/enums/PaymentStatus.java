package com.kh.app.transaction.payment.enums;

public enum PaymentStatus {

    READY,         // 결제 대기
    SUCCESS,       // 결제 성공
    FAILED,        // 결제 실패
    CANCELED,      // 결제 취소
    REFUNDED       // 환불 완료
}