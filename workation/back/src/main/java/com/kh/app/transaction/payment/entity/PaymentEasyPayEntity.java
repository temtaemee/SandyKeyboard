package com.kh.app.transaction.payment.entity;

import com.kh.app.transaction.payment.enums.EasyPayType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PAYMENT_EASYPAY")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class PaymentEasyPayEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EASYPAY_PAYMENT_ID")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PAYMENT_ID")
    private PaymentEntity payment;

    @Enumerated(EnumType.STRING)
    private EasyPayType easyPayType;

    private String methodType;

    private String purchaseCorp;
}