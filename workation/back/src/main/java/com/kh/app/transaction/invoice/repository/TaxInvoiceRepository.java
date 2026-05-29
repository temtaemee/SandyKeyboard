package com.kh.app.transaction.invoice.repository;

import com.kh.app.transaction.invoice.entity.TaxInvoiceEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaxInvoiceRepository extends JpaRepository<TaxInvoiceEntity, Long> {

    Optional<TaxInvoiceEntity> findByPayoutId(Long payoutId);

    // 판매자가 본인 앞으로 발행된 세금계산서를 모아볼 수 있는 쿼리 메서드
    Page<TaxInvoiceEntity> findBySellerIdOrderByIdDesc(Long sellerId, Pageable pageable);
}