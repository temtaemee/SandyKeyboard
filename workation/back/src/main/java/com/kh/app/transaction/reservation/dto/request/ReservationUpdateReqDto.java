package com.kh.app.transaction.reservation.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ReservationUpdateReqDto {

    // 대표 예약자 이름
    private String primaryGuestName;

    // 대표 예약자 전화번호
    private String primaryGuestPhone;

    // 대표 예약자 이메일
    private String primaryGuestEmail;

    // =========================
    // 환불 계좌 정보
    // =========================

    private String refundBankName;

    private String refundAccountNumber;

    private String refundAccountHolder;
}