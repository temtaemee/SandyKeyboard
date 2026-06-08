package com.kh.app.transaction.refund.controller;

import com.kh.app.transaction.refund.dto.request.RefundRequestDto;
import com.kh.app.transaction.refund.dto.response.RefundDetailResDto;
import com.kh.app.transaction.refund.dto.response.RefundListResDto;
import com.kh.app.transaction.refund.service.RefundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class RefundApiController {

    private final RefundService refundService;

    @PostMapping("/user/refund")
    public ResponseEntity<String> requestRefund(
            @RequestBody RefundRequestDto dto,
            @AuthenticationPrincipal(expression = "username") String username
    ) {
        log.info("환불 요청 접수 - 유저: {}, 예약번호: {}, 사유: {}", username, dto.getReservationId(), dto.getReason());

        refundService.refundReservation(dto, username);

        return ResponseEntity.ok("환불 및 결제 취소 처리가 성공적으로 완료되었습니다.");
    }

    @GetMapping("/user/refund/list")
    public ResponseEntity<List<RefundListResDto>> getMyRefunds(
            @AuthenticationPrincipal(expression = "username") String username
    ) {
        return ResponseEntity.ok(refundService.getMyRefunds(username));
    }

    @GetMapping("/user/refund/{id}")
    public ResponseEntity<RefundDetailResDto> getUserRefundDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal(expression = "username") String username
    ) {
        return ResponseEntity.ok(refundService.getUserRefundDetail(id, username));
    }

    // =========================================================================
    // 2. 판매자(Seller) 전용 환불 API
    // =========================================================================
    @GetMapping("/seller/refund/list")
    public ResponseEntity<Page<RefundListResDto>> getSellerRefunds(
            @AuthenticationPrincipal(expression = "username") String sellerUsername,
            @RequestParam(defaultValue = "0") int pno
    ) {
        return ResponseEntity.ok(refundService.getSellerRefunds(sellerUsername, pno));
    }

    @GetMapping("/seller/refund/{id}")
    public ResponseEntity<RefundDetailResDto> getSellerRefundDetail(
            @PathVariable Long id,
            @AuthenticationPrincipal(expression = "username") String sellerUsername
    ) {
        return ResponseEntity.ok(refundService.getSellerRefundDetail(id, sellerUsername));
    }

    // =========================================================================
    // 3. 관리자(Admin) 전용 환불 API
    // =========================================================================
    @GetMapping("/admin/refund/list")
    public ResponseEntity<Page<RefundListResDto>> getAdminRefunds(
            @RequestParam(defaultValue = "0") int pno
    ) {
        return ResponseEntity.ok(refundService.getAdminRefunds(pno));
    }

    @GetMapping("/admin/refund/{id}")
    public ResponseEntity<RefundDetailResDto> getAdminRefundDetail(@PathVariable Long id) {
        return ResponseEntity.ok(refundService.getAdminRefundDetail(id));
    }
}