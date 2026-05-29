package com.kh.app.transaction.invoice.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.transaction.payout.entity.PayoutEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "TAX_INVOICE")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class TaxInvoiceEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 국세청 고유 승인 번호 (UUID 기반 자동 생성 포맷)
    @Column(nullable = false, unique = true, length = 50)
    private String issueNo;

    // 어떤 정산 건을 바탕으로 발행된 계산서인지 매핑
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PAYOUT_ID", nullable = false)
    private PayoutEntity payout;

    // 공급 받는 자 (판매자)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SELLER_ID", nullable = false)
    private MemberEntity seller;

    // 공급가액 (수수료 원가)
    @Column(nullable = false)
    private Long supplyValue;

    // 부가세 (Tax = 수수료의 10%)
    @Column(nullable = false)
    private Long taxAmount;

    // 총 합계 금액 (공급가액 + 부가세)
    @Column(nullable = false)
    private Long totalAmount;

    @Column(nullable = false)
    private LocalDateTime issuedAt;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String status = "ISSUED"; // ISSUED(발행 완료), CANCELED(취소)
}