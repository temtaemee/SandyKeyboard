package com.kh.app.middle.coupon.dto.request;

import com.kh.app.middle.coupon.entity.CouponEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CouponCreateDto {

    private String couponName;
    private Integer discountRate;
    private Integer remainQty;
    private Integer validDays;

    public CouponEntity toEntity(String couponCode) {
        return CouponEntity.builder()
                .couponCode(couponCode)
                .couponName(couponName)
                .discountRate(discountRate)
                .remainQty(remainQty)
                .validDays(validDays)
                .build();
    }
}
