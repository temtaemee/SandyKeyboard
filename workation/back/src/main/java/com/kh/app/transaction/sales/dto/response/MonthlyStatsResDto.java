package com.kh.app.transaction.sales.dto.response;

import lombok.AllArgsConstructor; // 💡 추가
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor; // 💡 추가 (보통 필수)

@Getter
@Builder
@AllArgsConstructor // 💡 추가 필수: 빌더 패턴을 위해 필요
@NoArgsConstructor  // 💡 추가 권장: 역직렬화 등을 위해 필요
public class MonthlyStatsResDto {
    private String yearMonth;
    private Long totalNetSales;
}