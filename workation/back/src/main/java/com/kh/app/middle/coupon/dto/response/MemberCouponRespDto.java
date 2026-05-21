package com.kh.app.middle.coupon.dto.response;

import com.kh.app.middle.coupon.entity.MemberCouponEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class MemberCouponRespDto {

    private Long id;

    // member
    private Long memberId;
    private String username;

    // coupon
    private Long couponId;
    private String couponName;
    private Integer discountRate;
    private LocalDateTime expiredDate;

    private String usedYn;
    private LocalDateTime usedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static MemberCouponRespDto from(MemberCouponEntity entity) {
        return MemberCouponRespDto.builder()
                .id(entity.getId())
                .memberId(entity.getMember().getId())
                .username(entity.getMember().getUsername())
                .couponId(entity.getCouponId().getId())
                .couponName(entity.getCouponId().getCouponName())
                .discountRate(entity.getCouponId().getDiscountRate())
                .expiredDate(entity.getExpiredAt())
                .usedYn(entity.getUsedYn())
                .usedAt(entity.getUsedAt())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
