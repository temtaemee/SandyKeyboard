package com.kh.app.transaction.invoice.controller;

import com.kh.app.transaction.invoice.dto.response.TaxInvoiceDetailResDto;
import com.kh.app.transaction.invoice.service.TaxInvoiceService;
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
public class TaxInvoiceApiController {

    private final TaxInvoiceService taxInvoiceService;

    // [공통] 세금계산서 팝업창 출력을 위한 단건 원장 상세 조회
    @GetMapping("/auth/invoice/{invoiceId}")
    public ResponseEntity<TaxInvoiceDetailResDto> getInvoiceDetail(@PathVariable Long invoiceId) {
        log.info("세금계산서 상세 모달 조회 요청 - ID: {}", invoiceId);
        return ResponseEntity.ok(taxInvoiceService.getInvoiceDetail(invoiceId));
    }

    // [판매자 전용] 내 공간 매출 수수료에 대해 발행된 세금계산서 목록 가져오기
    @GetMapping("/seller/invoice/list")
    public ResponseEntity<Page<TaxInvoiceDetailResDto>> getSellerInvoices(
            @AuthenticationPrincipal(expression = "memberId") Long sellerId,
            @RequestParam(defaultValue = "0") int pno
    ) {
        log.info("판매자 세금계산서 목록 조회 - Seller ID: {}, Page: {}", sellerId, pno);
        Page<TaxInvoiceDetailResDto> result = taxInvoiceService.getSellerInvoiceList(sellerId, pno);
        return ResponseEntity.ok(result);
    }
}