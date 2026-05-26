package com.kh.app.transaction.refund.controller;

import com.kh.app.transaction.refund.dto.request.RefundRequestDto;
import com.kh.app.transaction.refund.service.RefundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}