package com.kh.app.middle.coupon.repository;

import com.kh.app.middle.coupon.entity.MemberCouponEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface MemberCouponRepositoryCustom {
    Page<MemberCouponEntity> getCouponList(Long id, Pageable pageable);
}
