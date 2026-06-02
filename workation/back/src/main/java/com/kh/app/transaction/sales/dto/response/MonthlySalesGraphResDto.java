package com.kh.app.transaction.sales.dto.response;

import lombok.AllArgsConstructor; // 💡 필수
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor; // 💡 권장
import java.util.List;

@Getter
@Builder
@AllArgsConstructor // 💡 모든 필드를 포함한 생성자를 자동 생성합니다. (에러 해결 핵심)
@NoArgsConstructor  // 💡 기본 생성자 (Jackson 직렬화 등을 위해 필요)
public class MonthlySalesGraphResDto {
    private List<MonthlyStatsResDto> sixMonths;
    private List<MonthlyStatsResDto> twelveMonths;
}