package com.kh.app.transaction.sales.service;

import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.reservation.repository.ReservationRepository;
import com.kh.app.transaction.sales.dto.response.DashboardSummaryResDto;
import com.kh.app.transaction.sales.dto.response.SalesSummaryResDto;
import com.kh.app.transaction.sales.entity.SalesEntity;
import com.kh.app.transaction.sales.repository.SalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SalesService {

    private final SalesRepository salesRepository;
    private final ReservationRepository reservationRepository;

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

    /**
     * 관리자 대시보드용 이번 달 통계 데이터 조회 (예약 수 + 취소 금액)
     */
    public DashboardSummaryResDto getThisMonthDashboardSummary() {
        // 1. 이번 달의 시작일과 종료일 계산
        YearMonth currentMonth = YearMonth.now();
        LocalDate startLocalDate = currentMonth.atDay(1);
        LocalDate endLocalDate = currentMonth.atEndOfMonth();

        // 2. 예약 수 산출용 파라미터 (LocalDate)
        long reservationCount = reservationRepository.countValidReservationsByCheckinDate(startLocalDate, endLocalDate);

        // 3. 매출 취소 금액 산출용 파라미터 (LocalDateTime 범위 변환)
        LocalDateTime startDateTime = startLocalDate.atStartOfDay();
        LocalDateTime endDateTime = endLocalDate.atTime(LocalTime.MAX);
        long totalCancelAmount = salesRepository.sumCancelAmountByMonth(startDateTime, endDateTime);

        // 4. 결합하여 결과 DTO 반환
        return DashboardSummaryResDto.builder()
                .thisMonthReservationCount(reservationCount)
                .thisMonthCancelAmount(totalCancelAmount)
                .build();
    }

    /**
     * 💡 판매자 본인의 실시간 매출 목록 조회 (페이징)
     */
    public Page<SalesEntity> getSellerSalesList(Long sellerId, int pno) {
        PageRequest pageRequest = PageRequest.of(pno, 10);
        return salesRepository.findBySellerId(sellerId, pageRequest);
    }

    /**
     * 💡 판매자 본인의 실시간 매출 요약 통계 정보 조회
     * (정산 전 단계의 실시간 총 결제액, 취소액, 순매출 합산)
     */
    public SalesSummaryResDto getSellerSalesSummary(Long sellerId) {
        // 전체 조회를 통해 집계 (성능 고도화가 필요할 경우 별도의 빌더 쿼리 작성 가능)
        Page<SalesEntity> allSales = salesRepository.findBySellerId(sellerId, Pageable.unpaged());

        long totalSales = 0L;
        long totalCancel = 0L;
        long totalNetSales = 0L;

        for (SalesEntity sales : allSales.getContent()) {
            totalSales += sales.getSalesAmount();
            totalCancel += sales.getCancelAmount();
            totalNetSales += sales.getNetSalesAmount();
        }

        return SalesSummaryResDto.builder()
                .totalSales(totalSales)
                .totalCancel(totalCancel)
                .totalNetSales(totalNetSales)
                .build();
    }



}