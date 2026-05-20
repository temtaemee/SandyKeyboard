package com.kh.app.middle;

import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.middle.coupon.entity.CouponStatus;
import com.kh.app.middle.coupon.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@Slf4j
public class CouponInit implements CommandLineRunner {

    private final CouponRepository couponRepository;

    private static final String WELCOME_COUPON_CODE = "WELCOME-10";

    @Override
    @Transactional
    public void run(String... args) {

        if (couponRepository.findByCouponCode(WELCOME_COUPON_CODE).isPresent()) {
            log.info("[CouponInit] 신규가입 환영쿠폰 이미 존재 — 삽입 스킵");
            return;
        }

        couponRepository.save(CouponEntity.builder()
                .couponCode(WELCOME_COUPON_CODE)
                .couponName("신규가입 환영쿠폰")
                .discountRate(10)
                .remainQty(9999)
                .couponStatus(CouponStatus.A)
                .validDays(7)
                .build());

        log.info("[CouponInit] 신규가입 환영쿠폰 삽입 완료");
    }
}
