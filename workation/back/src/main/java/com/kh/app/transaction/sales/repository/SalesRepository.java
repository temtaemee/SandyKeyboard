package com.kh.app.transaction.sales.repository;

import com.kh.app.transaction.sales.entity.SalesEntity;
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



}