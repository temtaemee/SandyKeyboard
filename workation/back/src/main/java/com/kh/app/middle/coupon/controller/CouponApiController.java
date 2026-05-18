package com.kh.app.middle.coupon.controller;

import com.kh.app.middle.coupon.dto.request.CouponCreateDto;
import com.kh.app.middle.coupon.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/coupon")
@RequiredArgsConstructor
public class CouponApiController {

    private final CouponService couponService;

    //쿠폰 신규 등록
    @PostMapping
    public ResponseEntity<Void> create(@RequestBody CouponCreateDto couponCreateDto){
        couponService.create(couponCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    //쿠폰 리스트 조회
    @GetMapping
    public void list(){

    }

    //쿠폰을 사용자에게 등록 (이벤트페이지에서)
    @PostMapping("{id}")
    public void register(@PathVariable Long couponId){

    }

    // 쿠폰 수정
    @PutMapping("{id}")
    public ResponseEntity<Void> update(@PathVariable Long couponId, @RequestBody CouponCreateDto couponCreateDto){
        couponService.update(couponId, couponCreateDto);
        return ResponseEntity.ok().build();
    }

    // 쿠폰 비활성화
    @DeleteMapping("{id}")
    public ResponseEntity<Void> disable(@PathVariable Long couponId){
        couponService.delete(couponId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
