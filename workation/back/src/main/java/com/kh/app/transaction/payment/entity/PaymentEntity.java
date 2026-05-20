package com.kh.app.transaction.payment.entity;

import com.kh.app.transaction.payment.enums.PaymentMethod;
import com.kh.app.transaction.payment.enums.PaymentStatus;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "PAYMENT")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PAYMENT_ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RESERVATION_ID", nullable = false)
    private ReservationEntity reservation;

    @Enumerated(EnumType.STRING)
    @Column(name = "PAYMENT_METHOD")
    private PaymentMethod paymentMethod;

    @Column(name = "PAYMENT_AMOUNT")
    private Long paymentAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "PAYMENT_STATUS")
    private PaymentStatus paymentStatus;

    @Column(name = "PG_PROVIDER")
    private String pgProvider;

    @Column(name = "PG_TID")
    private String pgTid;

    @Column(name = "PAID_AT")
    private LocalDateTime paidAt;

    @CreationTimestamp
    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    public void success(String pgTid) {
        this.paymentStatus = PaymentStatus.PAID;
        this.pgTid = pgTid;
        this.paidAt = LocalDateTime.now();
    }

    public void fail() {
        this.paymentStatus = PaymentStatus.FAILED;
    }

    public void cancel() {
        this.paymentStatus = PaymentStatus.CANCELLED;
    }
}