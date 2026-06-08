package com.kh.app.product.space.dto.request;

import com.kh.app.product.space.entity.Area;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class SpaceSearchReqDto {

    private String keyword;
    private Area area;
    private String visibleYn;
    private String delYn;

    // 공개 검색 추가 필터
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer capacity;
    private List<Long> arcadeIds;
}
