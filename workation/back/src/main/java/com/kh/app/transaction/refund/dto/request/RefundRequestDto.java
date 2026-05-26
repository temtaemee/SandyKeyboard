package com.kh.app.transaction.refund.dto.request;

import com.kh.app.transaction.refund.enums.RefundReason;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RefundRequestDto {
    private Long reservationId;  // 환불할 예약 번호
    private RefundReason reason; // 💡 Enum 타입으로 설정하여 4가지 사유 외의 값은 자동 차단합니다.
}