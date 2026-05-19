package com.kh.app.product.stay.dto.request;

import com.kh.app.product.space.entity.Area;
import com.kh.app.product.stay.entity.StayOption;
import lombok.Getter;
import lombok.Setter;

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
}
