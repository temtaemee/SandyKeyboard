package com.kh.app.product.space.entity;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Area {

    SEOUL("서울"),
    GYEONGGI("경기"),
    GANGWON("강원"),
    CHUNGNAM("충남"),
    CHUNGBUK("충북"),
    GYEONGNAM("경남"),
    GYEONGBUK("경북"),
    JEONNAM("전남"),
    JEONBUK("전북"),
    JEJU("제주");

    @JsonValue
    private final String description;

}
