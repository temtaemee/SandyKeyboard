package com.kh.app.transaction.payout.repository;

import com.kh.app.transaction.payment.enums.PayoutStatus;
import com.kh.app.transaction.payout.entity.PayoutEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayoutRepository extends JpaRepository<PayoutEntity, Long> {
    // 💡 판매자별 정산 내역 페이징 조회
    Page<PayoutEntity> findBySellerIdOrderByIdDesc(Long sellerId, Pageable pageable);

    // 1. 전체 정산 내역 페이징 조회
    Page<PayoutEntity> findAllByOrderByIdDesc(Pageable pageable);


    // 💡 특정 기간(정산 완료일 기준)의 정산금액 및 수수료 합계 조회
    @Query("SELECT SUM(p.payoutAmount), SUM(p.feeAmount) FROM PayoutEntity p " +
            "WHERE p.status = 'COMPLETED' " +
            "AND YEAR(p.payoutDate) = :year " +
            "AND MONTH(p.payoutDate) = :month")
    List<Object[]> sumAmountByYearMonth(@Param("year") int year, @Param("month") int month);

}