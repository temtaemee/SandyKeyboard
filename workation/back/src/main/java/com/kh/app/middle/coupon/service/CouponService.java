package com.kh.app.middle.coupon.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.middle.coupon.dto.request.CouponCreateDto;
import com.kh.app.middle.coupon.dto.request.MemberCouponReqDto;
import com.kh.app.middle.coupon.dto.response.CouponRespDto;
import com.kh.app.middle.coupon.dto.response.MemberCouponRespDto;
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
                .member(member)
                .couponId(coupon)
                .build();

        if(memberCouponEntity.isDuplicate(coupon.getCouponCode())){
            throw new IllegalStateException("[COUPON-7006] 이미 발급받은 쿠폰입니다.");
        }

        memberCouponRepository.save(memberCouponEntity);
    }

    // 멤버에게 쿠폰발급
    @Transactional
    public void adminRegister(MemberCouponReqDto reqDto) {

        MemberEntity member = memberRepository.findByUsernameAndDeletedAtIsNull(reqDto.getUsername()).orElseThrow(EntityNotFoundException::new);
        CouponEntity coupon = couponRepository.findByIdAndDelYn(reqDto.getCouponId(), "N").orElseThrow(EntityNotFoundException::new);

        MemberCouponEntity memberCouponEntity = MemberCouponEntity.builder()
                .member(member)
                .couponId(coupon)
                .build();

        if(memberCouponEntity.isDuplicate(coupon.getCouponCode())){
            throw new IllegalStateException("[COUPON-7006] 이미 발급받은 쿠폰입니다.");
        }

        memberCouponRepository.save(memberCouponEntity);
    }

    // 멤버에게 쿠폰 삭제
    @Transactional
    public void deleteMemberCoupon(MemberCouponReqDto reqDto) {
        MemberCouponEntity memberCouponEntity = memberCouponRepository.findByMemberUsernameAndCouponId(reqDto.getUsername(), reqDto.getCouponId()).orElseThrow(EntityNotFoundException::new);
        memberCouponRepository.delete(memberCouponEntity);
    }

    // 멤버가 쿠폰 사용
    @Transactional
    public void useMemberCoupon(String username, Long memberCouponId) {
        //쿠폰 정보 가져오기
        MemberCouponEntity memberCouponEntity = memberCouponRepository.findById(memberCouponId).orElseThrow(EntityNotFoundException::new);

        //쿠폰주인과 비교
        if (!memberCouponEntity.getMember().getUsername().equals(username)) {
            throw new IllegalStateException("[COUPON-7007] 본인의 쿠폰만 사용할 수 있습니다.");
        }

        //쿠폰 사용여부 확인
        if(memberCouponEntity.isUsed()){
            throw new IllegalStateException("[COUPON-7001] 이미 사용된 쿠폰입니다.");
        }

        //쿠폰 사용처리
        memberCouponEntity.useCoupon();

    }

    //멤버가 본인 보유 쿠폰 조회
    public Page<MemberCouponRespDto> getCouponList(String username, int pno) {
            MemberEntity memberEntity = memberRepository.findByUsernameAndDeletedAtIsNull(username).orElseThrow(EntityNotFoundException::new);

            Pageable pageable = PageRequest.of(pno, 10);
            return memberCouponRepository.getCouponList(memberEntity.getId(), pageable).map(MemberCouponRespDto::from);
    }
}
