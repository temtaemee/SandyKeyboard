package com.kh.app.transaction.payment.controller;

import com.kh.app.transaction.payment.dto.request.PaymentConfirmReqDto;
import com.kh.app.transaction.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentApiController {

    private final PaymentService paymentService;

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(
            @RequestBody PaymentConfirmReqDto dto
    ){

        paymentService.confirmPayment(dto);

        return ResponseEntity.ok("결제 승인 완료");
    }
}