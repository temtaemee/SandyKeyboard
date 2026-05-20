package com.kh.app.middle.coupon.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.middle.coupon.dto.request.CouponCreateDto;
import com.kh.app.middle.coupon.dto.request.MemberCouponReqDto;
import com.kh.app.middle.coupon.dto.request.UserMemberCouponReqDto;
import com.kh.app.middle.coupon.dto.response.CouponRespDto;
import com.kh.app.middle.coupon.dto.response.MemberCouponRespDto;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.middle.coupon.entity.MemberCouponEntity;
import com.kh.app.middle.coupon.repository.CouponRepository;
import com.kh.app.middle.coupon.repository.MemberCouponRepository;
import com.kh.app.middle.exception.ErrorCode;
import com.kh.app.middle.exception.MiddleException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class CouponService {

    private final CouponRepository couponRepository;
    private final MemberCouponRepository memberCouponRepository;
    private final MemberRepository memberRepository;

    // 쿠폰 등록
    @Transactional
    public void create(CouponCreateDto couponCreateDto) {
        String couponCode = generateCouponCode(couponCreateDto.getDiscountRate());
        couponRepository.save(couponCreateDto.toEntity(couponCode));
    }

    // 쿠폰코드 생성
    private String generateCouponCode(Integer discountRate) {
        String random = UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        return String.format("COUP-%d-%s", discountRate, random);
    }

    // 쿠폰 삭제
    @Transactional
    public void delete(Long couponId) {
        CouponEntity entity = couponRepository.findById(couponId)
                .orElseThrow(() -> new MiddleException(ErrorCode.NOT_EXIST_COUPON));
        entity.delete();
    }

    // 쿠폰 수정
    @Transactional
    public void update(Long couponId, CouponCreateDto couponCreateDto) {
        CouponEntity entity = couponRepository.findByIdAndDelYn(couponId, "N")
                .orElseThrow(() -> new MiddleException(ErrorCode.NOT_EXIST_COUPON));
        entity.update(couponCreateDto);
    }

    // 쿠폰 리스트 조회
    public Page<CouponRespDto> getList(int pno) {
        Pageable pageable = PageRequest.of(pno, 10);
        return couponRepository.getList(pageable).map(CouponRespDto::from);
    }

    //////////////////////// 멤버쿠폰

    // 멤버가 쿠폰 발급
    @Transactional
    public void register(Long couponId, String username) {
        MemberEntity member = memberRepository.findByUsernameAndDeletedAtIsNull(username)
                .orElseThrow(() -> new MiddleException(ErrorCode.MEMBER_NOT_FOUND));
        CouponEntity coupon = couponRepository.findByIdAndDelYn(couponId, "N")
                .orElseThrow(() -> new MiddleException(ErrorCode.NOT_EXIST_COUPON));

        if (memberCouponRepository.existsByMemberIdAndCouponIdId(member.getId(), couponId)) {
            throw new MiddleException(ErrorCode.DUPLICATE_COUPON_ISSUE);
        }

        memberCouponRepository.save(MemberCouponEntity.builder()
                .member(member)
                .couponId(coupon)
                .expiredAt(calcExpiredAt(coupon))
                .build());
        coupon.decrementQty();
    }

    // 멤버에게 쿠폰 발급 (어드민)
    @Transactional
    public void adminRegister(MemberCouponReqDto reqDto) {
        MemberEntity member = memberRepository.findByUsernameAndDeletedAtIsNull(reqDto.getUsername())
                .orElseThrow(() -> new MiddleException(ErrorCode.MEMBER_NOT_FOUND));
        CouponEntity coupon = couponRepository.findByIdAndDelYn(reqDto.getCouponId(), "N")
                .orElseThrow(() -> new MiddleException(ErrorCode.NOT_EXIST_COUPON));

        if (memberCouponRepository.existsByMemberIdAndCouponIdId(member.getId(), reqDto.getCouponId())) {
            throw new MiddleException(ErrorCode.DUPLICATE_COUPON_ISSUE);
        }

        memberCouponRepository.save(MemberCouponEntity.builder()
                .member(member)
                .couponId(coupon)
                .expiredAt(calcExpiredAt(coupon))
                .build());
        coupon.decrementQty();
    }

    // 발급 시점 기준 만료일 계산 (validDays == null 이면 무기한)
    private LocalDateTime calcExpiredAt(CouponEntity coupon) {
        return coupon.getValidDays() != null
                ? LocalDateTime.now().plusDays(coupon.getValidDays())
                : null;
    }

    // 멤버 쿠폰 삭제 (어드민)
    @Transactional
    public void deleteMemberCoupon(MemberCouponReqDto reqDto) {
        MemberCouponEntity memberCouponEntity = memberCouponRepository.findByMemberUsernameAndCouponId(reqDto.getUsername(), reqDto.getCouponId())
                .orElseThrow(() -> new MiddleException(ErrorCode.NOT_EXIST_COUPON));
        memberCouponRepository.delete(memberCouponEntity);
    }

    // 멤버가 쿠폰 사용
    @Transactional
    public void useMemberCoupon(String username, UserMemberCouponReqDto reqDto) {
        MemberCouponEntity memberCouponEntity = memberCouponRepository.findById(reqDto.getMemberCouponId())
                .orElseThrow(() -> new MiddleException(ErrorCode.NOT_EXIST_COUPON));

        if (!memberCouponEntity.getMember().getUsername().equals(username)) {
            throw new MiddleException(ErrorCode.COUPON_OWNER_RESTRICTION);
        }

        if (memberCouponEntity.isUsed()) {
            throw new MiddleException(ErrorCode.USED_COUPON);
        }

        if (memberCouponEntity.isExpired()) {
            throw new MiddleException(ErrorCode.EXPIRED_COUPON);
        }

        memberCouponEntity.useCoupon();
    }

    // 멤버가 본인 보유 쿠폰 조회
    public Page<MemberCouponRespDto> getCouponList(String username, int pno) {
        MemberEntity memberEntity = memberRepository.findByUsernameAndDeletedAtIsNull(username)
                .orElseThrow(() -> new MiddleException(ErrorCode.MEMBER_NOT_FOUND));
        Pageable pageable = PageRequest.of(pno, 10);
        return memberCouponRepository.getCouponList(memberEntity.getId(), pageable).map(MemberCouponRespDto::from);
    }
}
