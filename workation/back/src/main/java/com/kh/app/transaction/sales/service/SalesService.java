package com.kh.app.transaction.sales.service;

import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.sales.dto.response.SalesSummaryResDto;
import com.kh.app.transaction.sales.entity.SalesEntity;
import com.kh.app.transaction.sales.repository.SalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SalesService {

    private final SalesRepository salesRepository;

    /**
     * 💡 결제 완료 시 호출되어 매출 원장을 기록하는 로직 (PaymentService 등에서 호출)
     */
    @Transactional
    public void recordSales(PaymentEntity payment) {
        SalesEntity sales = SalesEntity.builder()
                .payment(payment)
                .salesAmount(payment.getAmount())
                .netSalesAmount(payment.getAmount())
                .salesDate(LocalDateTime.now())
                .build();
        salesRepository.save(sales);
    }


    /**
     * 💡 [추가] 예약/결제 ID를 기반으로 매출 원장을 찾아 반환하는 메서드
     */
    public SalesEntity findByPaymentId(Long paymentId) {
        return salesRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                        "해당 결제 건에 대한 매출 원장을 찾을 수 없습니다. 결제 ID: " + paymentId));
    }

    /**
     * 💡 관리자 대시보드용 전체 매출 통계 조회
     */
    public SalesSummaryResDto getSalesSummary() {
        List<SalesEntity> allSales = salesRepository.findAll();

        long totalSales = allSales.stream().mapToLong(SalesEntity::getSalesAmount).sum();
        long totalCancel = allSales.stream().mapToLong(SalesEntity::getCancelAmount).sum();
        long totalNetSales = allSales.stream().mapToLong(SalesEntity::getNetSalesAmount).sum();

        return SalesSummaryResDto.builder()
                .totalSales(totalSales)
                .totalCancel(totalCancel)
                .totalNetSales(totalNetSales)
                .build();
    }

    @Transactional
    public void handleCancel(Long paymentId, long finalRefundAmount) {
        // 결제 ID로 매출 전표를 찾음
        SalesEntity sales = salesRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                        "매출 정보를 찾을 수 없습니다. Payment ID: " + paymentId));

        // 엔티티 내부 핵심 비즈니스 메서드 활용
        // 기존 취소 금액에 이번 환불 금액을 더해서 업데이트
        long newCancelAmount = sales.getCancelAmount() + finalRefundAmount;
        sales.updateCancelAmount(newCancelAmount);

        salesRepository.save(sales);
    }
}