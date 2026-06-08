package com.kh.app.transaction.refund.dto.response;

import com.kh.app.transaction.refund.entity.RefundEntity;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class RefundListResDto {
    private Long refundId;
    private Long reservationId;
    private String stayName;         // 숙소명 (어디 취소했는지 직관적으로 확인)
    private String guestName;        // 예약자명 (판매자/관리자 확인용)
    private String memberUsername;   // 회원 아이디
    private Long refundAmount;       // 환불 금액
    private String refundReasonLabel;// 환불 사유 한글 레이블
    private LocalDateTime refundedAt;// 환불 일시

    public static RefundListResDto from(RefundEntity entity) {
        return RefundListResDto.builder()
                .refundId(entity.getId())
                .reservationId(entity.getReservation().getId())
                .stayName(entity.getReservation().getStay() != null ? entity.getReservation().getStay().getName() : null)
                .guestName(entity.getReservation().getPrimaryGuestName())
                .memberUsername(entity.getReservation().getMember() != null ? entity.getReservation().getMember().getUsername() : null)
                .refundAmount(entity.getRefundAmount())
                .refundReasonLabel(entity.getRefundReason() != null ? entity.getRefundReason().name() : null)
                .refundedAt(entity.getRefundedAt())
                .build();
    }
}