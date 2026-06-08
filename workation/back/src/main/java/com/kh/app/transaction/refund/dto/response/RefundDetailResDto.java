package com.kh.app.transaction.refund.dto.response;

import com.kh.app.product.stay.dto.response.StayResDto;
import com.kh.app.transaction.refund.entity.RefundEntity;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class RefundDetailResDto {
    // 1. 환불 고유 정보
    private Long refundId;
    private Long refundAmount;
    private String refundReason;
    private String transactionKey; // 토스 취소 고유 키 (관리자/판매자 정산 대조용)
    private LocalDateTime refundedAt;

    // 2. 예약 기본 정보 연동
    private Long reservationId;
    private String orderId;
    private String primaryGuestName;
    private String primaryGuestPhone;
    private String primaryGuestEmail;
    private Integer guestCount;
    private java.time.LocalDate checkinDate;
    private java.time.LocalDate checkoutDate;

    // 3. 연동된 숙소 정보 (이미 만들어둔 StayResDto 활용)
    private StayResDto stay;

    public static RefundDetailResDto of(RefundEntity refund, StayResDto stayResDto) {
        var reservation = refund.getReservation();
        return RefundDetailResDto.builder()
                .refundId(refund.getId())
                .refundAmount(refund.getRefundAmount())
                .refundReason(refund.getRefundReason() != null ? refund.getRefundReason().name() : null)
                .transactionKey(refund.getTransactionKey())
                .refundedAt(refund.getRefundedAt())

                .reservationId(reservation.getId())
                .orderId(reservation.getOrderId())
                .primaryGuestName(reservation.getPrimaryGuestName())
                .primaryGuestPhone(reservation.getPrimaryGuestPhone())
                .primaryGuestEmail(reservation.getPrimaryGuestEmail())
                .guestCount(reservation.getGuestCount())
                .checkinDate(reservation.getCheckinDate())
                .checkoutDate(reservation.getCheckoutDate())

                .stay(stayResDto)
                .build();
    }
}