package com.kh.app.transaction.sales.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SalesSummaryResDto {
    private Long totalSales;       // 총 매출
    private Long totalCancel;      // 총 취소액
    private Long totalNetSales;    // 순 매출
}