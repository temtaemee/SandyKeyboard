package com.kh.app.transaction.sales.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResDto {
    private long thisMonthReservationCount; // 이번 달 유효 예약 수 (RESERVED, COMPLETED)
    private long thisMonthCancelAmount;     // 이번 달 총 결제 취소 금액
}