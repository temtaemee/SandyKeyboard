package com.kh.app.product.space.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum SpacePictureCategory {

    EXTERIOR("외부/전경"),
    ROOM("객실"),
    BATHROOM("욕실"),
    FACILITY("공용시설"),
    AMENITY("부대시설"),
    DINING("식음료"),
    OTHERS("기타"),
    OFFICE("오피스");

    private final String description;


}
