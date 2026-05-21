package com.kh.app.transaction.payment.entity;

import com.kh.app.transaction.payment.enums.PaymentMethod;
import com.kh.app.transaction.payment.enums.PaymentStatus;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "PAYMENT")
@Getter
@Setter
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id")
    private ReservationEntity reservation;

    @Column(nullable = false, unique = true)
    private String orderId;

    @Column(unique = true)
    private String paymentKey;

    @Column(nullable = false)
    private Long amount; // 최초 결제 금액

    // 💡 [추가] 누적 취소(환불) 금액 (부분 취소 대응용, 기본값 0)
    @Column(nullable = false)
    private Long cancelAmount = 0L;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status; // SUCCESS, FAILED, CANCELED 등

    private String cardCompany;
    private String cardNumber;

    private String failReason; // 결제 승인 실패 사유

    // 💡 [추가] 결제 취소(환불) 사유
    private String cancelReason;

    private LocalDateTime approvedAt; // 결제 승인 시간

    // 💡 [추가] 결제 취소 시간
    private LocalDateTime canceledAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 💡 [추가] 편의 메소드: 비즈니스 로직에서 환불 처리 시 사용
    public void cancel(Long cancelAmount, String cancelReason) {
        this.status = PaymentStatus.CANCELED;
        this.cancelAmount = cancelAmount;
        this.cancelReason = cancelReason;
        this.canceledAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}