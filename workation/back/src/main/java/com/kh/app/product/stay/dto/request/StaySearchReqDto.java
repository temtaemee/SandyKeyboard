package com.kh.app.product.stay.dto.request;

import com.kh.app.product.space.entity.Area;
import com.kh.app.product.stay.entity.StayOption;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class StaySearchReqDto {

    private String keyword;

    private Long spaceId;

    private String workationYn;

    private Area area;

    private Integer minPrice;

    private Integer maxPrice;

    private Integer capacity;

    private List<StayOption> options;

    private String visibleYn;

    private String delYn;

    // 예약 가능 여부 표시용 날짜 (필터링이 아닌 availableYn 계산에만 사용)
    private LocalDate startDate;

    private LocalDate endDate;
}
