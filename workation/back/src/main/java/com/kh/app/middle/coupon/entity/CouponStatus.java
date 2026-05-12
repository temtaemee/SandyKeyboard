package com.kh.app.middle.coupon.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum CouponStatus {

    A("ACTIVE"), E("EXPIRED"), X("EXHAUSTED");

    private final String code;

}
