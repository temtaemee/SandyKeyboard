package com.kh.app.product.space.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Area {

    soeul("서울"),
    gyeonggi("경기"),
    gangwon("강원"),
    chungnam("충남"),
    chungbuk("충북"),
    gyeongnam("경남"),
    gyeongbuk("경북"),
    jeonnam("전남"),
    jeonbuk("전북"),
    jeju("제주");


    private final String description;

}
