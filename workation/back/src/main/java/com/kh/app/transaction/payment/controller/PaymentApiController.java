//package com.kh.app.transaction.payment.controller;
//
//import com.kh.app.transaction.payment.dto.request.PaymentCreateReqDto;
//import com.kh.app.transaction.payment.dto.response.PaymentResDto;
//import com.kh.app.transaction.payment.service.PaymentService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/api/user")
//@Slf4j
//public class PaymentController {
//
//    private final PaymentService paymentService;
//
//    @PostMapping("/reservations/{reservationId}/payments")
//    public ResponseEntity<PaymentResDto> create(
//            @PathVariable Long reservationId,
//            @RequestBody PaymentCreateReqDto dto
//    ) {
//
//        return ResponseEntity.ok(
//                paymentService.createPayment(
//                        reservationId,
//                        dto
//                )
//        );
//    }
//
//    @PostMapping("/payments/{paymentId}/approve")
//    public ResponseEntity<Void> approve(
//            @PathVariable Long paymentId
//    ) {
//
//        paymentService.approvePayment(paymentId);
//
//        return ResponseEntity.ok().build();
//    }
//
//    @PostMapping("/payments/{paymentId}/cancel")
//    public ResponseEntity<Void> cancel(
//            @PathVariable Long paymentId
//    ) {
//
//        paymentService.cancelPayment(paymentId);
//
//        return ResponseEntity.ok().build();
//    }
//}