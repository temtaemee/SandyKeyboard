package com.kh.app.transaction.payout.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.payment.enums.PayoutStatus;
import com.kh.app.transaction.payout.entity.PayoutEntity;
import com.kh.app.transaction.payout.repository.PayoutRepository;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.sales.entity.SalesEntity;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PayoutServiceTest {

    @Mock
    private PayoutRepository payoutRepository;

    @InjectMocks
    private PayoutService payoutService;

    @Test
    void createPayoutTargetCalculatesFeesAndSaves() {
        MemberEntity seller = MemberEntity.builder().id(2L).username("seller1").build();
        SpaceEntity space = SpaceEntity.builder()
                .seller(seller)
                .build();
        StayEntity stay = StayEntity.builder()
                .space(space)
                .build();
        ReservationEntity reservation = ReservationEntity.builder().stay(stay).build();
        PaymentEntity payment = new PaymentEntity();
        payment.setReservation(reservation);

        SalesEntity sales = SalesEntity.builder()
                .payment(payment)
                .netSalesAmount(100000L)
                .build();

        payoutService.createPayoutTarget(sales);

        ArgumentCaptor<PayoutEntity> captor = ArgumentCaptor.forClass(PayoutEntity.class);
        verify(payoutRepository, times(1)).save(captor.capture());

        PayoutEntity payout = captor.getValue();
        assertThat(payout.getSeller()).isEqualTo(seller);
        assertThat(payout.getOriginalAmount()).isEqualTo(100000L);
        assertThat(payout.getFeeAmount()).isEqualTo(10000L); // 10% fee
        assertThat(payout.getPayoutAmount()).isEqualTo(90000L); // original - fee
        assertThat(payout.getStatus()).isEqualTo(PayoutStatus.READY);
    }

    @Test
    void completePayoutChangesStatusToPaid() {
        Long payoutId = 1L;
        PayoutEntity payout = PayoutEntity.builder()
                .id(payoutId)
                .status(PayoutStatus.READY)
                .build();

        when(payoutRepository.findById(payoutId)).thenReturn(Optional.of(payout));

        payoutService.completePayout(payoutId);

        assertThat(payout.getStatus()).isEqualTo(PayoutStatus.COMPLETED);
        assertThat(payout.getPayoutDate()).isNotNull();
    }

    @Test
    void completePayoutThrowsExceptionIfNotFound() {
        Long payoutId = 1L;
        when(payoutRepository.findById(payoutId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> payoutService.completePayout(payoutId))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("정산 대상을 찾을 수 없습니다");
    }
}
