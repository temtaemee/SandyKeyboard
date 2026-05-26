package com.kh.app.transaction.refund.entity;

import com.kh.app.transaction.refund.enums.RefundReason; // 💡 Enum 임포트
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "refund")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class RefundEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 예약에 대한 환불인지 연결
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private ReservationEntity reservation;

    // 토스페이먼츠 취소 트랜잭션 고유 키 (정산 및 대조용)
    @Column(nullable = false, unique = true)
    private String transactionKey;

    // 실제 환불(취소)된 금액
    @Column(nullable = false)
    private Long refundAmount;

    // 💡 [수정] String에서 타입 안전한 RefundReason Enum으로 변경 완료!
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RefundReason refundReason;

    // 토스 서버에서 통보해 준 실제 취소 완료 일시
    @Column(nullable = false)
    private LocalDateTime refundedAt;

    // =========================================================================
    // 비즈니스 생성 메서드 규격도 Enum에 맞게 수정
    // =========================================================================
    public static RefundEntity createRefund(
            ReservationEntity reservation,
            String transactionKey,
            Long refundAmount,
            RefundReason refundReason, // 💡 Enum 타입 반영
            LocalDateTime refundedAt
    ) {
        return RefundEntity.builder()
                .reservation(reservation)
                .transactionKey(transactionKey)
                .refundAmount(refundAmount)
                .refundReason(refundReason)
                .refundedAt(refundedAt)
                .build();
    }
}