package com.kh.app.transaction.refund.service;

import com.kh.app.product.stay.repository.StayOptionRepository;
import com.kh.app.product.stay.repository.StayPictureRepository;
import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.payment.repository.PaymentRepository;
import com.kh.app.transaction.refund.dto.request.RefundRequestDto;
import com.kh.app.transaction.refund.entity.RefundEntity;
import com.kh.app.transaction.refund.enums.RefundReason;
import com.kh.app.transaction.refund.repository.RefundRepository;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import com.kh.app.transaction.reservation.repository.ReservationRepository;
import com.kh.app.transaction.sales.service.SalesService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefundServiceTest {

    @Mock
    private RefundRepository refundRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private StayOptionRepository stayOptionRepository;

    @Mock
    private StayPictureRepository stayPictureRepository;

    @Mock
    private SalesService salesService;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private RefundService refundService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(refundService, "restTemplate", restTemplate);
        ReflectionTestUtils.setField(refundService, "tossSecretKey", "test-secret-key");
    }

    @Test
    void refundReservationFailsIfAlreadyRefunded() {
        RefundRequestDto dto = new RefundRequestDto();
        dto.setReservationId(1L);

        ReservationEntity reservation = ReservationEntity.builder()
                .id(1L)
                .status(ReservationStatus.REFUND_COMPLETED)
                .build();

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        assertThatThrownBy(() -> refundService.refundReservation(dto, "user1"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("이미 환불 처리가 완료된 예약입니다");
    }

    @Test
    void refundReservationFailsIfNoRefundPeriod() {
        RefundRequestDto dto = new RefundRequestDto();
        dto.setReservationId(1L);

        ReservationEntity reservation = ReservationEntity.builder()
                .id(1L)
                .status(ReservationStatus.RESERVED)
                .checkinDate(LocalDate.now()) // 0 days left
                .paidAt(LocalDateTime.now())
                .build();

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        assertThatThrownBy(() -> refundService.refundReservation(dto, "user1"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("환불 가능 기간");
    }

    @Test
    void refundReservationSuccess() {
        RefundRequestDto dto = new RefundRequestDto();
        dto.setReservationId(1L);
        dto.setReason(RefundReason.SIMPLE_CHANGE);

        ReservationEntity reservation = ReservationEntity.builder()
                .id(1L)
                .status(ReservationStatus.RESERVED)
                .checkinDate(LocalDate.now().plusDays(15)) // 15 days left -> 100% refund
                .paidAt(LocalDateTime.now())
                .build();

        PaymentEntity payment = new PaymentEntity();
        payment.setId(1L);
        payment.setAmount(10000L);
        payment.setPaymentKey("test-payment-key");
        payment.setOrderId("test-order-id");

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(paymentRepository.findByReservation(reservation)).thenReturn(Optional.of(payment));

        Map<String, Object> mockResponse = new HashMap<>();
        mockResponse.put("status", "DONE");
        mockResponse.put("cancels", java.util.Collections.singletonList(
                Map.of("transactionKey", "mock-tx-key", "canceledAt", "2026-05-21T14:35:09+09:00")
        ));

        when(restTemplate.postForEntity(anyString(), any(HttpEntity.class), eq(Map.class)))
                .thenReturn(new ResponseEntity<>(mockResponse, HttpStatus.OK));

        refundService.refundReservation(dto, "user1");

        assertThat(reservation.getStatus()).isEqualTo(ReservationStatus.REFUND_COMPLETED);
        verify(salesService, times(1)).handleCancel(eq(payment.getId()), eq(10000L));
        verify(refundRepository, times(1)).save(any(RefundEntity.class));
    }
}
