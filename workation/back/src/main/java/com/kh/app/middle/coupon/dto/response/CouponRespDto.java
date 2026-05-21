package com.kh.app.middle.coupon.dto.response;

import com.kh.app.middle.coupon.entity.CouponEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class CouponRespDto {
    private Long id;
    private String couponCode;
    private String couponName;
    private Integer discountRate;
    private Integer remainQty;
    private String couponStatus;
    private Integer validDays;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CouponRespDto from(CouponEntity entity) {
        return CouponRespDto.builder()
                .id(entity.getId())
                .couponCode(entity.getCouponCode())
                .couponName(entity.getCouponName())
                .discountRate(entity.getDiscountRate())
                .remainQty(entity.getRemainQty())
                .couponStatus(entity.getCouponStatus().getCode())
                .validDays(entity.getValidDays())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
