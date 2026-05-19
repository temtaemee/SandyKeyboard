package com.kh.app.middle.coupon.dto.request;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.middle.coupon.entity.MemberCouponEntity;
import lombok.Getter;

@Getter
public class MemberCouponReqDto {

    private String username;
    private Long couponId;


}
