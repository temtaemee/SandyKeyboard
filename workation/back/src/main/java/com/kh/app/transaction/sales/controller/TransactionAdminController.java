package com.kh.app.transaction.sales.controller;

import com.kh.app.transaction.payout.dto.response.PayoutListResDto;
import com.kh.app.transaction.payout.service.PayoutService;
import com.kh.app.transaction.sales.dto.response.DashboardSummaryResDto;
import com.kh.app.transaction.sales.dto.response.MonthlySalesStatsResDto;
import com.kh.app.transaction.sales.dto.response.SalesSummaryListResDto;
import com.kh.app.transaction.sales.dto.response.SalesSummaryResDto;
import com.kh.app.transaction.sales.entity.SalesEntity;
import com.kh.app.transaction.sales.service.SalesService;
import io.swagger.v3.oas.annotations.Operation;
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

    //[어드민 전용]
    @GetMapping("/admin/dashboard/summary")
    @Operation(summary = "관리자 대시보드 통계 조회", description = "이번 달 유효 예약 수 및 당월 누적 결제 취소 금액을 실시간 조회합니다.")
    public ResponseEntity<DashboardSummaryResDto> getDashboardSummary() {
        DashboardSummaryResDto summary = salesService.getThisMonthDashboardSummary();
        return ResponseEntity.ok(summary);
    }

    // [어드민 전용] 전체 정산 내역 리스트 조회
    @GetMapping("/admin/payout/list")
    @Operation(summary = "관리자 전체 정산 목록 조회", description = "플랫폼의 전체 정산 내역을 페이지 단위로 조회합니다.")
    public ResponseEntity<Page<PayoutListResDto>> getAdminPayoutList(
            @RequestParam(defaultValue = "0") int pno
    ) {
        Page<PayoutListResDto> result = payoutService.getAllPayoutList(pno);
        return ResponseEntity.ok(result);
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


    /**
     * 💡 [판매자 전용] 본인이 등록한 장소들의 실시간 매출 요약 통계 조회 (총액, 취소액, 순매출)
     */
    @GetMapping("/seller/sales/summary")
    @Operation(summary = "판매자 실시간 매출 요약 조회", description = "정산 배치 가동 전, 현재까지 결제된 실시간 순매출 현황을 집계합니다.")
    public ResponseEntity<SalesSummaryResDto> getSellerSalesSummary(
            @AuthenticationPrincipal(expression = "memberId") Long sellerId
    ) {
        return ResponseEntity.ok(salesService.getSellerSalesSummary(sellerId));
    }

    /**
     * 💡 [판매자 전용] 본인이 등록한 장소들의 실시간 개별 매출 전표 내역 목록 조회 (페이징)
     */
    @GetMapping("/seller/sales/list")
    @Operation(summary = "판매자 실시간 매출 목록 조회", description = "결제 건별 상세 매출 발생 원장을 페이징 조회합니다.")
    public ResponseEntity<Page<SalesSummaryListResDto>> getSellerSalesList(
            @AuthenticationPrincipal(expression = "memberId") Long sellerId,
            @RequestParam(defaultValue = "0") int pno
    ) {
        Page<SalesEntity> salesPage = salesService.getSellerSalesList(sellerId, pno);

        // 💡 [초간결 리팩토링 완료] DTO 내부 정적 팩토리 메서드를 호출하여 한 줄로 매핑합니다.
        Page<SalesSummaryListResDto> responsePage = salesPage.map(SalesSummaryListResDto::from);

        return ResponseEntity.ok(responsePage);
    }

    //어드민 월별정산 조회
    @GetMapping("/admin/payout/summary")
    @Operation(summary = "정산 통계 조회", description = "기본값은 자동 계산된 기간, 파라미터 전달 시 해당 월 정산 요약 조회")
    public ResponseEntity<com.kh.app.transaction.payout.dto.response.PayoutSummaryResDto> getPayoutSummary(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        return ResponseEntity.ok(payoutService.getPayoutStatistics(year, month));
    }

    //어드민 지역별 매출 조회
    @GetMapping("/admin/sales/monthly-stats")
    public ResponseEntity<MonthlySalesStatsResDto> getMonthlyStats(
            @RequestParam int year,
            @RequestParam int month
    ) {
        return ResponseEntity.ok(salesService.getMonthlySalesStatistics(year, month));
    }



}