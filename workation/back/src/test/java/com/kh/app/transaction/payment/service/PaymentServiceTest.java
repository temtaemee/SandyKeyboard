package com.kh.app.transaction.payment.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.app.middle.coupon.repository.MemberCouponRepository;
import com.kh.app.notification.service.NotificationService;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.transaction.payment.dto.request.PaymentConfirmReqDto;
import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.payment.enums.PaymentStatus;
import com.kh.app.transaction.payment.exception.PaymentConfirmException;
import com.kh.app.transaction.payment.repository.PaymentRepository;
import com.kh.app.transaction.payout.service.PayoutService;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import com.kh.app.transaction.reservation.repository.ReservationRepository;
import com.kh.app.transaction.sales.service.SalesService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedConstruction;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private SalesService salesService;

    @Mock
    private PayoutService payoutService;

    @Mock
    private MemberCouponRepository memberCouponRepository;

    @Mock
    private PaymentFailureRecorder paymentFailureRecorder;

    @InjectMocks
    private PaymentService paymentService;

    @Test
    void confirmPaymentFailsIfAlreadyProcessed() {
        PaymentConfirmReqDto dto = new PaymentConfirmReqDto();
        dto.setPaymentKey("mock-payment-key");

        when(paymentRepository.existsByPaymentKey(dto.getPaymentKey())).thenReturn(true);

        assertThatThrownBy(() -> paymentService.confirmPayment(dto, "user1"))
                .isInstanceOf(PaymentConfirmException.class)
                .hasMessageContaining("이미 처리된 결제입니다");
    }

    @Test
    void confirmPaymentFailsForNonOwner() {
        PaymentConfirmReqDto dto = new PaymentConfirmReqDto();
        dto.setPaymentKey("mock-payment-key");
        dto.setReservationId(1L);

        MemberEntity owner = MemberEntity.builder()
                .username("owner-user")
                .build();

        ReservationEntity reservation = ReservationEntity.builder()
                .id(1L)
                .member(owner)
                .build();

        when(paymentRepository.existsByPaymentKey(dto.getPaymentKey())).thenReturn(false);
        when(reservationRepository.findById(dto.getReservationId())).thenReturn(Optional.of(reservation));

        assertThatThrownBy(() -> paymentService.confirmPayment(dto, "non-owner-user"))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void confirmPaymentSuccess() {
        PaymentConfirmReqDto dto = new PaymentConfirmReqDto();
        dto.setPaymentKey("mock-payment-key");
        dto.setReservationId(1L);
        dto.setOrderId("mock-order-id");
        dto.setAmount(10000L);

        MemberEntity owner = MemberEntity.builder()
                .username("owner-user")
                .build();

        com.kh.app.member.entity.MemberEntity seller = com.kh.app.member.entity.MemberEntity.builder().id(2L).build();
        com.kh.app.product.space.entity.SpaceEntity space = com.kh.app.product.space.entity.SpaceEntity.builder()
                .seller(seller)
                .build();
        com.kh.app.product.stay.entity.StayEntity stay = com.kh.app.product.stay.entity.StayEntity.builder()
                .name("Mock Stay")
                .space(space)
                .build();

        ReservationEntity reservation = ReservationEntity.builder()
                .id(1L)
                .member(owner)
                .stay(stay)
                .status(ReservationStatus.PENDING)
                .build();

        when(paymentRepository.existsByPaymentKey(dto.getPaymentKey())).thenReturn(false);
        when(reservationRepository.findById(dto.getReservationId())).thenReturn(Optional.of(reservation));

        String mockResponseBody = "{\"method\":\"간편결제\",\"easyPay\":{\"provider\":\"카카오페이\"},\"approvedAt\":\"2026-05-21T14:35:09+09:00\"}";

        try (MockedConstruction<RestTemplate> mocked = mockConstruction(RestTemplate.class, (mock, context) -> {
            when(mock.exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
                    .thenReturn(new ResponseEntity<>(mockResponseBody, HttpStatus.OK));
        })) {
            paymentService.confirmPayment(dto, "owner-user");
        }

        verify(paymentRepository, times(1)).save(any(PaymentEntity.class));
        assertThat(reservation.getStatus()).isEqualTo(ReservationStatus.PAYMENT_COMPLETED);
        verify(salesService, times(1)).recordSales(any(PaymentEntity.class));
    }

    @Test
    void confirmPaymentTossApiErrorTriggersFailureRecorder() {
        PaymentConfirmReqDto dto = new PaymentConfirmReqDto();
        dto.setPaymentKey("mock-payment-key");
        dto.setReservationId(1L);
        dto.setOrderId("mock-order-id");
        dto.setAmount(10000L);

        MemberEntity owner = MemberEntity.builder()
                .username("owner-user")
                .build();

        ReservationEntity reservation = ReservationEntity.builder()
                .id(1L)
                .member(owner)
                .status(ReservationStatus.PENDING)
                .build();

        when(paymentRepository.existsByPaymentKey(dto.getPaymentKey())).thenReturn(false);
        when(reservationRepository.findById(dto.getReservationId())).thenReturn(Optional.of(reservation));

        RestClientResponseException tossException = new RestClientResponseException(
                "Toss API error", 400, "Bad Request", null, "{\"message\":\"Invalid API Key\"}".getBytes(), null);

        try (MockedConstruction<RestTemplate> mocked = mockConstruction(RestTemplate.class, (mock, context) -> {
            when(mock.exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
                    .thenThrow(tossException);
        })) {
            assertThatThrownBy(() -> paymentService.confirmPayment(dto, "owner-user"))
                    .isInstanceOf(PaymentConfirmException.class)
                    .hasMessageContaining("Toss 결제 승인 API가 실패했습니다");
        }

        verify(paymentFailureRecorder, times(1)).record(eq(reservation), eq(dto), anyString());
    }
}
