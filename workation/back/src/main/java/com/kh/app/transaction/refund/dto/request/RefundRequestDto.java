package com.kh.app.transaction.refund.dto.request;

import com.kh.app.transaction.refund.enums.RefundReason;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Setter
public class RefundRequestDto {
    private Long reservationId;   // 환불할 예약 번호

    // [추가] 컴파일 에러 해결을 위한 필드 추가
    private long cancelAmount;    // 환불 요청 금액
    private String cancelReason;  // 환불 사유 (문자열)

    private RefundReason reason;  // 기존 Enum 타입 사유 (필요 시 유지)
}