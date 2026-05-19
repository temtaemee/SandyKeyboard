package com.kh.app.middle.coupon.controller;

import com.kh.app.middle.coupon.dto.request.CouponCreateDto;
import com.kh.app.middle.coupon.dto.request.MemberCouponReqDto;
import com.kh.app.middle.coupon.dto.response.CouponRespDto;
import com.kh.app.middle.coupon.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CouponApiController {

    private final CouponService couponService;

    //쿠폰 신규 등록
    @PostMapping("/admin/coupon")
    public ResponseEntity<Void> create(@RequestBody CouponCreateDto couponCreateDto){
        couponService.create(couponCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    //쿠폰 리스트 조회
    @GetMapping("/admin/coupon")
    public ResponseEntity<Page<CouponRespDto>> list(@RequestParam(defaultValue = "0") int pno){
        Page<CouponRespDto> couponList = couponService.getList(pno);
        return ResponseEntity.ok(couponList);
    }


    // 쿠폰 수정
    @PutMapping("/admin/coupon/{couponId}")
    public ResponseEntity<Void> update(@PathVariable Long couponId, @RequestBody CouponCreateDto couponCreateDto){
        couponService.update(couponId, couponCreateDto);
        return ResponseEntity.ok().build();
    }

    // 쿠폰 비활성화
    @DeleteMapping("/admin/coupon/{couponId}")
    public ResponseEntity<Void> disable(@PathVariable Long couponId){
        couponService.delete(couponId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    ////////////// member coupon
    //쿠폰을 사용자가 발급 (이벤트페이지에서)
    @PostMapping("/user/coupon/{couponId}")
    public ResponseEntity<Void> register(@PathVariable Long couponId){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        couponService.register(couponId, username);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 쿠폰을 어드민이 사용자에게 지급
    @PostMapping("/admin/memberCoupon")
    public ResponseEntity<Void> adminRegister(@RequestBody MemberCouponReqDto reqDto){
        couponService.adminRegister(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    //멤버쿠폰 삭제
    @DeleteMapping("/admin/memberCoupon")
    public void deleteMemberCoupon(){

    }

    //멤버쿠폰 수정
    @PutMapping("/admin/memberCoupon")
    public void updateMemberCoupon(){

    }

    //멤버쿠폰 조회
    @GetMapping("/user/memberCoupon")
    public void getMemberCoupon(){

    }

    //유저가 멤버쿠폰 사용
    @PutMapping("/user/memberCoupon")
    public void useMemberCoupon(){

    }
}
