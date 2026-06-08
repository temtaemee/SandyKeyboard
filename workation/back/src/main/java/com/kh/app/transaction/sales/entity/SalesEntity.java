package com.kh.app.transaction.sales.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.transaction.payment.entity.PaymentEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "SALES")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class SalesEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 결제 건으로 인해 발생한 매출인지 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PAYMENT_ID", nullable = false)
    private PaymentEntity payment;

    // 매출 금액 (소비자가 결제한 총금액)
    @Column(nullable = false)
    private Long salesAmount;

    // 취소/환불 등으로 인한 차감 금액 (기본값 0)
    @Builder.Default
    @Column(nullable = false)
    private Long cancelAmount = 0L;

    // 실제 순매출 (salesAmount - cancelAmount)
    @Column(nullable = false)
    private Long netSalesAmount;

    @Column(nullable = false)
    private LocalDateTime salesDate;

    // 환불 등으로 인한 매출 수정 비즈니스 메서드
    public void updateCancelAmount(Long cancelAmount) {
        this.cancelAmount = cancelAmount;
        this.netSalesAmount = this.salesAmount - cancelAmount;
    }
}