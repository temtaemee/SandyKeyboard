package com.kh.app.middle.coupon.service;

import com.kh.app.middle.coupon.dto.request.CouponCreateDto;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.middle.coupon.repository.CouponRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class CouponService {

    private final CouponRepository couponRepository;

    //쿠폰등록
    @Transactional
    public void create(CouponCreateDto couponCreateDto) {
        // 
        LocalDateTime couponExiredDate = updateExpriedDate(couponCreateDto.getExpriedDate());
        String couponCode = generateCouponCode(couponCreateDto.getDiscountRate(), couponExiredDate);
        CouponEntity entity = couponCreateDto.toEntity(couponCode, couponExiredDate);
        couponRepository.save(entity);
    }

    //쿠폰코드 생성
    private String generateCouponCode(Integer discountRate, LocalDateTime expriedDate) {
        String random = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        return String.format("COUP-%d-%s-%s", discountRate, expriedDate.format(DateTimeFormatter.ofPattern("yyyyMMdd")), random);
    }

    //쿠폰 유효날짜 수정
    private LocalDateTime updateExpriedDate(String days) {
        return LocalDateTime.now().plusDays(Integer.parseInt(days));
    }


    //쿠폰삭제
    @Transactional
    public void delete(Long couponId) {
        CouponEntity entity = couponRepository.findById(couponId).orElseThrow(EntityNotFoundException::new);
        entity.delete();
    }

    //쿠폰 수정
    @Transactional
    public void update(Long couponId, CouponCreateDto couponCreateDto) {
        CouponEntity entity = couponRepository.findById(couponId).orElseThrow(EntityNotFoundException::new);
        entity.update(couponCreateDto);
    }
}
