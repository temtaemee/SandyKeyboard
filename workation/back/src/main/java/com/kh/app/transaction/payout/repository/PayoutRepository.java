package com.kh.app.transaction.payout.repository;

import com.kh.app.transaction.payment.enums.PayoutStatus;
import com.kh.app.transaction.payout.entity.PayoutEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PayoutRepository extends JpaRepository<PayoutEntity, Long> {
    // 💡 판매자별 정산 내역 페이징 조회
    Page<PayoutEntity> findBySellerIdOrderByIdDesc(Long sellerId, Pageable pageable);

    // 1. 전체 정산 내역 페이징 조회
    Page<PayoutEntity> findAllByOrderByIdDesc(Pageable pageable);



}