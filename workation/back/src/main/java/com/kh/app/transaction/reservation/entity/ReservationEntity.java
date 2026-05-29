package com.kh.app.transaction.reservation.entity;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.product.stay.entity.StayEntity; // 💡 추가
import com.kh.app.transaction.reservation.dto.request.ReservationUpdateReqDto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "RESERVATION")
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Setter
public class ReservationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 예약 회원
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private MemberEntity member;

    // 쿠폰
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COUPON_ID")
    private CouponEntity coupon;

    // 💡 숙소 예약-stay 연결 복구
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "STAY_ID", nullable = false)
    private StayEntity stay;

    // 인원수
    @Column(nullable = false)
    private Integer guestCount;

    // 대표 예약자 이름
    @Column(nullable = false, length = 100)
    private String primaryGuestName;

    // 체크인
    @Column(nullable = false)
    private LocalDate checkinDate;

    // 체크아웃
    @Column(nullable = false)
    private LocalDate checkoutDate;

    // 대표 예약자 전화번호
    @Column(nullable = false, length = 11)
    private String primaryGuestPhone;

    // 대표 예약자 이메일
    @Column(nullable = false, length = 255)
    private String primaryGuestEmail;

    // 원가
    @Column(nullable = false)
    private Long originalPrice;

    // 할인 금액
    @Column(nullable = false)
    @Builder.Default
    private Long discountAmount = 0L;

    // 최종 결제 금액
    @Column(nullable = false)
    private Long totalPrice;

    // 생성일
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 예약 상태
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ReservationStatus status = ReservationStatus.PENDING;

    private LocalDateTime paidAt;

    @Column(length = 50)
    private String refundBankName;

    @Column(length = 50)
    private String refundAccountNumber;

    @Column(length = 100)
    private String refundAccountHolder;

    @Column(unique = true)
    private String orderId;

    // =========================
    // 상태 변경 및 기능 메서드들 (기존과 동일)
    // =========================

    public void completePayment() {
        if (this.status != ReservationStatus.PENDING) {
            throw new IllegalStateException("결제 가능한 상태가 아닙니다.");
        }
        this.status = ReservationStatus.PAYMENT_COMPLETED;
        this.paidAt = LocalDateTime.now();
    }

    public void cancelByUser() {
        if (this.status != ReservationStatus.PENDING && this.status != ReservationStatus.PAYMENT_COMPLETED) {
            throw new IllegalStateException("사용자 취소 가능한 상태가 아닙니다.");
        }
        this.status = ReservationStatus.USER_CANCELLED;
    }


    public void refund() {
        if (this.status != ReservationStatus.USER_CANCELLED && this.status != ReservationStatus.SELLER_CANCELLED) {
            throw new IllegalStateException("환불 가능한 상태가 아닙니다.");
        }
        if (this.paidAt == null) {
            throw new IllegalStateException("결제 이력이 없는 예약입니다.");
        }
        this.status = ReservationStatus.REFUND_COMPLETED;
    }

    @PrePersist
    private void prePersist() {
        if (this.status == null) {
            this.status = ReservationStatus.PENDING;
        }
        this.createdAt = LocalDateTime.now();
        validateTarget();
    }

    private void validateTarget() {
        if (this.stay == null) {
            throw new IllegalStateException("예약 대상 숙소가 없습니다.");
        }
    }

    public void update(ReservationUpdateReqDto reqDto) {
        validateEditable();
        this.primaryGuestName = reqDto.getPrimaryGuestName();
        this.primaryGuestPhone = reqDto.getPrimaryGuestPhone();
        this.primaryGuestEmail = reqDto.getPrimaryGuestEmail();

    }

    private void validateEditable() {
        if (this.status == ReservationStatus.PENDING) {
            throw new IllegalStateException("결제 완료 이후에만 예약 정보를 수정할 수 있습니다.");
        }
        if (this.status != ReservationStatus.PAYMENT_COMPLETED) {
            throw new IllegalStateException("현재 상태에서는 예약 정보를 수정할 수 없습니다. (현재 상태: " + this.status.getLabel() + ")");
        }
    }

    /**
     * 💡 판매자가 예약을 최종 승인할 때
     */
    public void approveBySeller() {
        if (this.status != ReservationStatus.PAYMENT_COMPLETED) {
            throw new IllegalStateException("결제가 완료된 예약만 승인할 수 있습니다.");
        }
        this.status = ReservationStatus.RESERVED; // "예약 확정"
    }

    /**
     * 💡 판매자가 예약을 거절/취소할 때
     */
    public void cancelBySeller() {
        if (this.status != ReservationStatus.PAYMENT_COMPLETED && this.status != ReservationStatus.RESERVED) {
            throw new IllegalStateException("취소 가능한 예약 상태가 아닙니다.");
        }
        this.status = ReservationStatus.SELLER_CANCELLED; // "판매자 취소"
    }

    /**
     * 💡 구매자가 예약을 온전히 이행 완료(체크아웃 이후 완료 처리)했을 때
     */
    public void completeUsage() {
        if (this.status != ReservationStatus.RESERVED) {
            throw new IllegalStateException("확정된 예약 건만 이용 완료 처리가 가능합니다.");
        }
        this.status = ReservationStatus.COMPLETED; // "이용 완료" -> 이후 리뷰 작성 가능 상태
    }
    public void updateStatus(ReservationStatus status) {
        this.status = status;
    }
}