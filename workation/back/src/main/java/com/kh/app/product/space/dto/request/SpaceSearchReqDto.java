package com.kh.app.product.space.dto.request;

import com.kh.app.product.space.entity.Area;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SpaceSearchReqDto {

    private String keyword;

    private Area area;

    private String visibleYn;
}
