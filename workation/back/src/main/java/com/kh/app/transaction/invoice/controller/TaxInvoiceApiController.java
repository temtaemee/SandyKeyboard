package com.kh.app.transaction.invoice.controller;

import com.kh.app.product.space.dto.response.SpaceResDto;
import com.kh.app.product.space.service.SpaceService;
import com.kh.app.transaction.invoice.dto.response.TaxInvoiceDetailResDto;
import com.kh.app.transaction.invoice.service.TaxInvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Parameter;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class TaxInvoiceApiController {

    private final TaxInvoiceService taxInvoiceService;
    private final SpaceService spaceService;


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

    // 1. 관리자용 전체 세금계산서 목록 조회
    @GetMapping("/admin/invoice/list")
    public ResponseEntity<List<TaxInvoiceDetailResDto>> getAllTaxInvoices() {
        return ResponseEntity.ok(taxInvoiceService.findAllForAdmin());
    }

    // 2. 관리자용 세금계산서 상세보기
    @Operation(summary = "공개 공간 상세 조회",
            description = "visibleYn=Y, delYn=N 조건이 강제 적용됩니다. 비공개 공간은 404 반환.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "공간 없음 또는 비공개",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/admin/invoice/{id}")
    public ResponseEntity<SpaceResDto> selectOne(
            @Parameter(description = "공간 ID", required = true) @PathVariable Long id // 💡 @Parameter 추가
    ) {
        return ResponseEntity.ok(spaceService.selectOneForPublic(id));
    }
}