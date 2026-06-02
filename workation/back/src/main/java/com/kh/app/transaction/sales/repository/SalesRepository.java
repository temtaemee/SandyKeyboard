package com.kh.app.transaction.sales.repository;

import com.kh.app.transaction.sales.entity.SalesEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SalesRepository extends JpaRepository<SalesEntity, Long> {
    Optional<SalesEntity> findByPaymentId(Long paymentId);

    /**
     * 💡 [추가] 특정 기간 내 발생한 매출 중 정산 원장(PAYOUT)에 등록되지 않은 순수 매출 데이터만 조회
     */
    @Query("SELECT s FROM SalesEntity s " +
            "WHERE s.salesDate >= :start AND s.salesDate <= :end " +
            "AND s.id NOT IN (SELECT p.sales.id FROM PayoutEntity p)")
    List<SalesEntity> findUnprocessedSales(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // 💡 조건: 이번 달 매출 전표 데이터 중 누적된 총 취소 금액(cancelAmount)의 합산 구하기
    @Query("SELECT COALESCE(SUM(s.cancelAmount), 0) FROM SalesEntity s " +
            "WHERE s.salesDate >= :start AND s.salesDate <= :end")
    long sumCancelAmountByMonth(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    /**
     * 💡 판매자 고유 ID 기반 실시간 매출 목록 페이징 조회
     * 정산(Payout)과 상관없이 결제 완료 시점의 매출 전표를 최신순으로 가져옵니다.
     */
    @Query("SELECT s FROM SalesEntity s " +
            "JOIN s.payment p " +
            "JOIN p.reservation r " +
            "JOIN r.stay st " +
            "JOIN st.space sp " +
            "WHERE sp.seller.id = :sellerId " +
            "ORDER BY s.id DESC")
    Page<SalesEntity> findBySellerId(@Param("sellerId") Long sellerId, Pageable pageable);

    // 어드민 이 지역별 매출조회
    @Query("SELECT s.payment.reservation.stay.space.area, SUM(s.netSalesAmount) " +
            "FROM SalesEntity s " +
            "WHERE FUNCTION('YEAR', s.salesDate) = :year " +
            "AND FUNCTION('MONTH', s.salesDate) = :month " +
            "GROUP BY s.payment.reservation.stay.space.area")
    List<Object[]> sumNetSalesByArea(@Param("year") int year, @Param("month") int month);

    @Query("SELECT SUM(s.salesAmount), SUM(s.cancelAmount), SUM(s.netSalesAmount) FROM SalesEntity s " +
            "WHERE FUNCTION('YEAR', s.salesDate) = :year " +
            "AND FUNCTION('MONTH', s.salesDate) = :month")
    Object[] sumSalesByYearMonth(@Param("year") int year, @Param("month") int month);



}