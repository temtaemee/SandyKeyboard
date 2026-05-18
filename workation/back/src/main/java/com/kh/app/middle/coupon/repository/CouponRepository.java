package com.kh.app.middle.coupon.repository;

import com.kh.app.middle.coupon.entity.CouponEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CouponRepository extends JpaRepository<CouponEntity, Long>, CouponRepositoryCustom {
}
