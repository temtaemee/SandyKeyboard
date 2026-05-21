package com.kh.app.middle.coupon.controller;

import com.kh.app.middle.coupon.dto.request.CouponCreateDto;
import com.kh.app.middle.coupon.dto.request.MemberCouponReqDto;
import com.kh.app.middle.coupon.dto.request.UserMemberCouponReqDto;
import com.kh.app.middle.coupon.dto.response.CouponRespDto;
import com.kh.app.middle.coupon.dto.response.MemberCouponRespDto;
import com.kh.app.middle.coupon.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Coupon", description = "쿠폰 관리 API")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CouponApiController {

    private final CouponService couponService;

    @Operation(summary = "쿠폰 신규 등록 (관리자)", description = "관리자가 새로운 쿠폰을 등록합니다.")
    @PostMapping("/admin/coupon")
    public ResponseEntity<Void> create(@RequestBody CouponCreateDto couponCreateDto){
        couponService.create(couponCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "쿠폰 목록 조회 (관리자)", description = "username 파라미터가 있으면 해당 회원의 쿠폰 목록, 없으면 전체 쿠폰 목록을 조회합니다.")
    @GetMapping("/admin/coupon")
    public ResponseEntity<Page<?>> list(@RequestParam(defaultValue = "0") int pno, @RequestParam(required = false) String username){
        if (username != null && !username.isBlank()) {
            Page<MemberCouponRespDto> couponList = couponService.getCouponList(username, pno);
            return ResponseEntity.ok(couponList);
        }
        Page<CouponRespDto> couponList = couponService.getList(pno);
        return ResponseEntity.ok(couponList);
    }

    @Operation(summary = "쿠폰 수정 (관리자)", description = "관리자가 특정 쿠폰 정보를 수정합니다.")
    @PutMapping("/admin/coupon/{couponId}")
    public ResponseEntity<Void> update(@PathVariable Long couponId, @RequestBody CouponCreateDto couponCreateDto){
        couponService.update(couponId, couponCreateDto);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "쿠폰 비활성화 (관리자)", description = "관리자가 특정 쿠폰을 비활성화합니다.")
    @DeleteMapping("/admin/coupon/{couponId}")
    public ResponseEntity<Void> disable(@PathVariable Long couponId){
        couponService.delete(couponId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @Operation(summary = "쿠폰 단건 조회 (공개)", description = "이벤트 페이지에서 특정 쿠폰 정보를 조회합니다.")
    @GetMapping("/public/coupon/{couponId}")
    public ResponseEntity<CouponRespDto> listOne(@PathVariable Long couponId){
        CouponRespDto coupon = couponService.getOne(couponId);
        return ResponseEntity.ok(coupon);
    }

    @Operation(summary = "쿠폰 발급 (사용자)", description = "사용자가 이벤트 페이지에서 쿠폰을 발급받습니다.")
    @PostMapping("/user/coupon/{couponId}")
    public ResponseEntity<Void> register(@PathVariable Long couponId){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        couponService.register(couponId, username);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "쿠폰 사용자 지급 (관리자)", description = "관리자가 특정 사용자에게 쿠폰을 지급합니다.")
    @PostMapping("/admin/memberCoupon")
    public ResponseEntity<Void> adminRegister(@RequestBody MemberCouponReqDto reqDto){
        couponService.adminRegister(reqDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "회원 쿠폰 삭제 (관리자)", description = "관리자가 특정 회원의 쿠폰을 삭제합니다.")
    @DeleteMapping("/admin/memberCoupon")
    public ResponseEntity<Object> deleteMemberCoupon(@RequestBody MemberCouponReqDto reqDto){
        couponService.deleteMemberCoupon(reqDto);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @Operation(summary = "본인 보유 쿠폰 조회 (사용자)", description = "로그인한 사용자가 본인이 보유한 쿠폰 목록을 조회합니다.")
    @GetMapping("/user/memberCoupon")
    public ResponseEntity<Page<MemberCouponRespDto>> getMemberCoupon(@RequestParam(defaultValue = "0") int pno){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Page<MemberCouponRespDto> couponList = couponService.getCouponList(username, pno);
        return ResponseEntity.ok(couponList);
    }

    @Operation(summary = "쿠폰 사용 (사용자)", description = "사용자가 보유 쿠폰을 사용합니다.")
    @PutMapping("/user/memberCoupon")
    public ResponseEntity<Object> useMemberCoupon(@RequestBody UserMemberCouponReqDto reqDto){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        couponService.useMemberCoupon(username, reqDto);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
