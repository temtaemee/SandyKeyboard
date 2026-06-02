package com.kh.app.transaction.sales.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class MonthlySalesStatsResDto {
    private SalesSummaryResDto totalSalesInfo;     // 전체 매출 요약
    private List<AreaSalesResDto> areaSalesList;   // 지역별 매출 목록
}