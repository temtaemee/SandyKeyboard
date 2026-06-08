package com.kh.app.transaction.payout.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.transaction.payment.enums.PayoutStatus;
import com.kh.app.transaction.sales.entity.SalesEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "PAYOUT")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class PayoutEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 대상 판매자 정보 연동
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SELLER_ID", nullable = false)
    private MemberEntity seller;

    // 어떤 매출 원장에서 파생되었는지 연동
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SALES_ID", nullable = false)
    private SalesEntity sales;

    // 정산 대상 원본 금액
    @Column(nullable = false)
    private Long originalAmount;

    // 플랫폼 수수료액
    @Column(nullable = false)
    private Long feeAmount;

    // 판매자에게 최종 지급할 금액 (originalAmount - feeAmount)
    @Column(nullable = false)
    private Long payoutAmount;

    // 정산 상태 (READY, REQUESTED, COMPLETED 등 프로젝트 내장 Enum 활용)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PayoutStatus status = PayoutStatus.READY;

    private LocalDateTime payoutDate;

    // 정산 완료 처리 비즈니스 메서드
    public void completePayout() {
        if (this.status == PayoutStatus.COMPLETED) {
            throw new IllegalStateException("이미 완료된 정산 건입니다.");
        }
        this.status = PayoutStatus.COMPLETED;
        this.payoutDate = LocalDateTime.now();
    }
}