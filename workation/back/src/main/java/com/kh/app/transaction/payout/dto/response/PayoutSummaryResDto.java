package com.kh.app.transaction.payout.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PayoutSummaryResDto {
    private int year;
    private int month;
    private Long totalPayoutAmount; // 판매자에게 지급될 최종 금액 합계
    private Long totalFeeAmount;    // 플랫폼 수수료 합계


    // 💡 정적 팩토리 메서드로 매핑 로직 캡슐화
    public static PayoutSummaryResDto from(int year, int month, Object[] row) {
        return PayoutSummaryResDto.builder()
                .year(year)
                .month(month)
                .totalPayoutAmount(row != null && row[0] != null ? (Long) row[0] : 0L)
                .totalFeeAmount(row != null && row[1] != null ? (Long) row[1] : 0L)
                .build();
    }
}