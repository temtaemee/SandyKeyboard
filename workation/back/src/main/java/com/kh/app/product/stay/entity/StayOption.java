package com.kh.app.product.stay.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum StayOption {


    // 가구 및 기본 시설
    DESK("책상"),
    PRIVATE_BATHROOM("개인 욕실"),
    BATHTUB("욕조"),
    SHOWER_BOOTH("샤워부스"),
    BIDET("비데"),
    AMENITY("어메니티"),

    // 주방 시설
    KITCHEN("주방"),
    COOKING_AVAILABLE("취사 가능"),
    MICROWAVE("전자레인지"),
    INDUCTION("인덕션"),
    REFRIGERATOR("냉장고"),
    TABLEWARE("식기류"),
    COFFEE_MACHINE("커피머신"),

    // 조망 (View)
    OCEAN_VIEW("오션뷰"),
    CITY_VIEW("시티뷰"),
    MOUNTAIN_VIEW("마운틴뷰"),
    GARDEN_VIEW("가든뷰"),
    RIVER_VIEW("리버뷰");

    private final String description;


}
