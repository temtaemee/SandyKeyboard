package com.kh.app.middle.coupon.scheduler;

import com.kh.app.middle.coupon.entity.MemberCouponEntity;
import com.kh.app.middle.coupon.repository.MemberCouponRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CouponScheduler {

    private final MemberCouponRepository memberCouponRepository;

    // 매일 자정 실행
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void expireMemberCoupons() {
        List<MemberCouponEntity> toExpire = memberCouponRepository.findToExpire(LocalDateTime.now());

        toExpire.forEach(MemberCouponEntity::expire);

        log.info("[CouponScheduler] 만료 처리 완료 — {}건", toExpire.size());
    }
}
