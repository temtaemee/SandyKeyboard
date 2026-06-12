package com.kh.app.transaction.payment.controller;

import com.kh.app.transaction.payment.dto.request.PaymentConfirmReqDto;
import com.kh.app.transaction.payment.exception.PaymentConfirmException;
import com.kh.app.transaction.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentApiController {

    private final PaymentService paymentService;

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(
            @RequestBody PaymentConfirmReqDto dto,
            @AuthenticationPrincipal(expression = "username") String username
    ){

        try {
            paymentService.confirmPayment(dto, username);
            return ResponseEntity.ok(Map.of(
                    "result", "success",
                    "message", "결제 승인 완료"
            ));
        } catch (PaymentConfirmException e) {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("result", "fail");
            body.put("message", e.getMessage());
            if (e.getProviderBody() != null && !e.getProviderBody().isBlank()) {
                body.put("providerBody", e.getProviderBody());
            }
            return ResponseEntity.status(e.getStatusCode()).body(body);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "result", "fail",
                    "message", e.getMessage()
            ));
        }
    }
}
