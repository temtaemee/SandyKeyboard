package com.kh.app.transaction.refund.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TossCancelResDto {
    private Long cancelAmount;       // 취소된 금액
    private String cancelReason;     // 취소 사유
    private String canceledAt;       // 취소된 일시 (ISO 8601 문자열 포맷)
    private String transactionKey;   // 💡 [핵심] 취소 건에 대한 국세청/토스 고유 거래 키 (정산 대조용)
}