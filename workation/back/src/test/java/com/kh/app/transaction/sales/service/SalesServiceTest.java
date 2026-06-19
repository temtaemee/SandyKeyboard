package com.kh.app.transaction.sales.service;

import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.sales.entity.SalesEntity;
import com.kh.app.transaction.sales.repository.SalesRepository;
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
class SalesServiceTest {

    @Mock
    private SalesRepository salesRepository;

    @InjectMocks
    private SalesService salesService;

    @Test
    void recordSalesSavesCorrectSalesEntity() {
        PaymentEntity payment = new PaymentEntity();
        payment.setId(1L);
        payment.setAmount(15000L);

        salesService.recordSales(payment);

        ArgumentCaptor<SalesEntity> captor = ArgumentCaptor.forClass(SalesEntity.class);
        verify(salesRepository, times(1)).save(captor.capture());

        SalesEntity savedSales = captor.getValue();
        assertThat(savedSales.getPayment()).isEqualTo(payment);
        assertThat(savedSales.getSalesAmount()).isEqualTo(15000L);
        assertThat(savedSales.getNetSalesAmount()).isEqualTo(15000L);
        assertThat(savedSales.getCancelAmount()).isEqualTo(0L);
    }

    @Test
    void handleCancelUpdatesCancelAmountAndSaves() {
        Long paymentId = 1L;
        long refundAmount = 5000L;

        SalesEntity sales = SalesEntity.builder()
                .id(10L)
                .salesAmount(15000L)
                .cancelAmount(2000L)
                .netSalesAmount(13000L)
                .build();

        when(salesRepository.findByPaymentId(paymentId)).thenReturn(Optional.of(sales));

        salesService.handleCancel(paymentId, refundAmount);

        verify(salesRepository, times(1)).save(sales);
        assertThat(sales.getCancelAmount()).isEqualTo(7000L);
        assertThat(sales.getNetSalesAmount()).isEqualTo(8000L); // netSalesAmount updates dynamically inside updateCancelAmount()
    }

    @Test
    void handleCancelThrowsExceptionIfSalesNotFound() {
        Long paymentId = 1L;
        when(salesRepository.findByPaymentId(paymentId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> salesService.handleCancel(paymentId, 5000L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("매출 정보를 찾을 수 없습니다");
    }
}
