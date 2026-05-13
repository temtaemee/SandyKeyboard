package com.kh.app.transaction.reservation.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReservationStatus {


    PENDING("예약대기"),
    APPROVED("예약승인"),
    CANCELLED("예약취소"),
    REJECTED("예약거절"),
    COMPLETED("예약이행");

    private final String label;

}
