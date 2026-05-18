package com.kh.app.transaction.reservation.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReservationStatus {


    REQUESTED("예약신청"),
    REVIEW_APPROVED("심사승인"),
    PAYMENT_COMPLETED("예약완료"),//결제완료후
    CANCELLED("예약취소"),
    REJECTED("예약거절"),
    COMPLETED("이용완료");

    private final String label;
}