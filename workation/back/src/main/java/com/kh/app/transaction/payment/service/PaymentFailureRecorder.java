package com.kh.app.transaction.payment.service;

import com.kh.app.transaction.payment.dto.request.PaymentConfirmReqDto;
import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.payment.enums.PaymentMethod;
import com.kh.app.transaction.payment.enums.PaymentStatus;
import com.kh.app.transaction.payment.repository.PaymentRepository;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentFailureRecorder {

    private final PaymentRepository paymentRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(ReservationEntity reservation, PaymentConfirmReqDto dto, String errorMessage) {
        try {
            if (paymentRepository.existsByOrderId(dto.getOrderId())
                    || paymentRepository.existsByPaymentKey(dto.getPaymentKey())) {
                log.warn("Payment failure history already exists. orderId={}, paymentKey={}",
                        dto.getOrderId(), dto.getPaymentKey());
                return;
            }

            PaymentEntity failPayment = new PaymentEntity();
            failPayment.setReservation(reservation);
            failPayment.setOrderId(dto.getOrderId());
            failPayment.setPaymentKey(dto.getPaymentKey());
            failPayment.setAmount(dto.getAmount());
            failPayment.setPaymentMethod(PaymentMethod.CARD);
            failPayment.setStatus(PaymentStatus.FAILED);
            failPayment.setFailReason(errorMessage);

            paymentRepository.saveAndFlush(failPayment);
            log.info("Payment failure history saved. orderId={}", dto.getOrderId());
        } catch (Exception ex) {
            log.error("Failed to save payment failure history. orderId={}", dto.getOrderId(), ex);
        }
    }
}
