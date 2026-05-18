package com.kh.app.transaction.payment.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PAYMENT_CARD")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class PaymentCardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CARD_PAYMENT_ID")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PAYMENT_ID")
    private PaymentEntity payment;

    private String cardCorpCode;

    private String cardNumber;

    private Integer installMonth;

    private String approveNo;
}