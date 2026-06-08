package com.kh.app.transaction.reservation.controller;

import com.kh.app.transaction.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReservationStatusController {

    private final ReservationService reservationService;

    // [판매자 전용 API] 예약 접수 건 승인 처리 (RESERVED)
    @PatchMapping("/seller/approve/{reservationId}")
    public ResponseEntity<Void> approveReservation(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal(expression = "username") String sellerUsername
    ) {
        reservationService.approveReservation(reservationId, sellerUsername);
        return ResponseEntity.ok().build();
    }

    // [판매자 전용 API] 예약 접수 건 거절/취소 처리 (SELLER_CANCELLED)
    @PatchMapping("/seller/cancel/{reservationId}")
    public ResponseEntity<Void> cancelReservationBySeller(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal(expression = "username") String sellerUsername
    ) {
        reservationService.cancelReservationBySeller(reservationId, sellerUsername);
        return ResponseEntity.ok().build();
    }

    // [구매자 전용 API] 이용 완료 수동 확정 (COMPLETED)
    // 이용 완료 상태로 변경되면, 기존에 설계 중이신 리뷰 패키지에서
    // "상태가 COMPLETED인 예약 아이디가 존재할 때만 리뷰 작성 허용" 하도록 인터셉터나 검증 로직을 걸기 편해집니다.
    @PatchMapping("/user/complete/{reservationId}")
    public ResponseEntity<Void> completeReservation(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal(expression = "username") String username
    ) {
        reservationService.completeReservation(reservationId, username);
        return ResponseEntity.ok().build();
    }
}