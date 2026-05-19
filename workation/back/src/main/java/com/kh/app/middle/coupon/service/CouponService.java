package com.kh.app.middle.coupon.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.middle.coupon.dto.request.CouponCreateDto;
import com.kh.app.middle.coupon.dto.request.MemberCouponReqDto;
import com.kh.app.middle.coupon.dto.response.CouponRespDto;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.middle.coupon.entity.MemberCouponEntity;
import com.kh.app.middle.coupon.repository.CouponRepository;
import com.kh.app.middle.coupon.repository.MemberCouponRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    private final MemberCouponRepository memberCouponRepository;
    private final MemberRepository memberRepository;

    //쿠폰등록
    @Transactional
    public void create(CouponCreateDto couponCreateDto) {
        //쿠폰 만료일자 계산
        LocalDateTime couponExiredDate = updateExpriedDate(couponCreateDto.getExpiredDate());
        //쿠폰코드 생성
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
        LocalDateTime couponExiredDate = updateExpriedDate(couponCreateDto.getExpiredDate());
        CouponEntity entity = couponRepository.findByIdAndDelYn(couponId, "N").orElseThrow(EntityNotFoundException::new);
        entity.update(couponCreateDto, couponExiredDate);
    }

    // 쿠폰 리스트 조회
    public Page<CouponRespDto> getList(int pno) {
        Pageable pageable = PageRequest.of(pno, 10);
        return couponRepository.getList(pageable).map(CouponRespDto::from);
    }

/// ////////////////////// 멤버쿠폰
    // 멤버가 쿠폰 발급
    @Transactional
    public void register(Long couponId, String username) {
        MemberEntity member = memberRepository.findByUsernameAndDeletedAtIsNull(username)
                .orElseThrow(EntityNotFoundException::new);
        CouponEntity coupon = couponRepository.findByIdAndDelYn(couponId, "N").orElseThrow(EntityNotFoundException::new);


        MemberCouponEntity memberCouponEntity = MemberCouponEntity.builder()
                .memberId(member)
                .couponId(coupon)
                .build();

        memberCouponRepository.save(memberCouponEntity);
    }

    // 멤버에게 쿠폰발급
    @Transactional
    public void adminRegister(MemberCouponReqDto reqDto) {

        MemberEntity member = memberRepository.findByUsernameAndDeletedAtIsNull(reqDto.getUsername()).orElseThrow(EntityNotFoundException::new);
        CouponEntity coupon = couponRepository.findByIdAndDelYn(reqDto.getCouponId(), "N").orElseThrow(EntityNotFoundException::new);

        MemberCouponEntity memberCouponEntity = MemberCouponEntity.builder()
                .memberId(member)
                .couponId(coupon)
                .build();

        memberCouponRepository.save(memberCouponEntity);
    }
}
