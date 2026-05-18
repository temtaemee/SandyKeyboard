package com.kh.app.transaction.payment.entity;

import com.kh.app.transaction.payment.enums.LogType;
import com.kh.app.transaction.payment.enums.PaymentStep;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "PAYMENT_LOG")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class PaymentLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PAYMENT_ID")
    private PaymentEntity payment;

    private String orderId;

    @Enumerated(EnumType.STRING)
    private LogType logType;

    @Enumerated(EnumType.STRING)
    private PaymentStep step;

    private String apiUrl;

    @Lob
    private String rawData;

    private String resultCode;

    @Lob
    private String resultMsg;

    private String userAgent;

    private String clientIp;

    @CreationTimestamp
    private LocalDateTime createdAt;
}