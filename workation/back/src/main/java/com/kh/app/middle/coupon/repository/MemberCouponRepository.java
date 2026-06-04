package com.kh.app.middle.coupon.repository;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.middle.coupon.entity.MemberCouponEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


public interface MemberCouponRepository extends JpaRepository<MemberCouponEntity, Long>, MemberCouponRepositoryCustom {
    Optional<MemberCouponEntity> findByMemberUsernameAndCouponId(String username, Long couponId);

    boolean existsByMemberIdAndCouponIdId(Long memberId, Long couponId);

    Optional<MemberCouponEntity> findByMemberAndCouponId(MemberEntity member, CouponEntity couponId);

    @Query("SELECT mc FROM MemberCouponEntity mc WHERE mc.expiredAt < :now AND mc.usedYn = 'N' AND mc.expiredYn = 'N'")
    List<MemberCouponEntity> findToExpire(@Param("now") LocalDateTime now);
}
