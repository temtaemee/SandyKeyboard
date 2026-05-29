package com.kh.app.transaction.sales.controller;

import com.kh.app.transaction.payout.dto.response.PayoutListResDto;
import com.kh.app.transaction.payout.service.PayoutService;
import com.kh.app.transaction.sales.dto.response.SalesSummaryResDto;
import com.kh.app.transaction.sales.service.SalesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class TransactionAdminController {

    private final SalesService salesService;
    private final PayoutService payoutService;

    // [어드민 전용] 플랫폼 전체 매출 요약 통계 정보 조회
    @GetMapping("/admin/sales/summary")
    public ResponseEntity<SalesSummaryResDto> getAdminSalesSummary() {
        return ResponseEntity.ok(salesService.getSalesSummary());
    }

    // [어드민 전용] 특정 정산 대상을 정산 완료(지급 완료) 처리
    @PatchMapping("/admin/payout/{payoutId}/complete")
    public ResponseEntity<Void> completePayout(@PathVariable Long payoutId) {
        payoutService.completePayout(payoutId);
        return ResponseEntity.ok().build();
    }

    // [판매자 전용] 로그인한 판매자의 정산 완료 내역 리스트 조회
    @GetMapping("/seller/payout/list")
    public ResponseEntity<Page<PayoutListResDto>> getSellerPayouts(
            @AuthenticationPrincipal(expression = "memberId") Long sellerId,
            @RequestParam(defaultValue = "0") int pno
    ) {
        log.info("판매자 정산 목록 요청 - Seller ID: {}, Page: {}", sellerId, pno);
        Page<PayoutListResDto> result = payoutService.getSellerPayoutList(sellerId, pno);
        return ResponseEntity.ok(result);
    }
}