package com.kh.app.middle.coupon.repository;

import com.kh.app.middle.coupon.entity.MemberCouponEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface MemberCouponRepository extends JpaRepository<MemberCouponEntity, Long>, MemberCouponRepositoryCustom {
    Optional<MemberCouponEntity> findByMemberUsernameAndCouponId(String username, Long couponId);
}
