package com.kh.app.middle.coupon.repository;

import com.kh.app.middle.coupon.entity.CouponEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CouponRepository extends JpaRepository<CouponEntity, Long>, CouponRepositoryCustom {
    Optional<CouponEntity> findByIdAndDelYn(Long couponId, String n);
    Optional<CouponEntity> findByCouponCode(String couponCode);
}
