package com.kh.app.transaction.reservation.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ReservationStatus {


    PENDING("결제대기"),
    APPROVED("예약완료"),
    CANCELLED("예약취소"),
    REJECTED("예약거절"),
    COMPLETED("예약이행"),
    EXPIRED("예약만료");          // 미결제 자동취소

    private final String label;

}
