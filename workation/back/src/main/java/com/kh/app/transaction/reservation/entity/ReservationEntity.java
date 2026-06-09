package com.kh.app.transaction.reservation.entity;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.stay.entity.StayEntity;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private MemberEntity member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COUPON_ID")
    private CouponEntity coupon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "STAY_ID", nullable = false)
    private StayEntity stay;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_id")
    private SpaceEntity space;

    @Column(nullable = false)
    private Integer guestCount;

    @Column(nullable = false, length = 100)
    private String primaryGuestName;

    @Column(nullable = false)
    private LocalDate checkinDate;

    @Column(nullable = false)
    private LocalDate checkoutDate;

    @Column(nullable = false, length = 11)
    private String primaryGuestPhone;

    @Column(nullable = false, length = 255)
    private String primaryGuestEmail;

    @Column(nullable = false)
    private Long originalPrice;

    @Column(nullable = false)
    @Builder.Default
    private Long discountAmount = 0L;

    @Column(nullable = false)
    private Long totalPrice;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

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


    // ==========================================
    // 💡 비즈니스 도메인 상태 변경 메서드 (수정 및 최적화)
    // ==========================================

    /**
     * 1. Toss 결제 성공 시 호출
     */
    public void completePayment() {
        if (this.status != ReservationStatus.PENDING) {
            throw new IllegalStateException("결제 가능한 상태가 아닙니다.");
        }
        this.status = ReservationStatus.PAYMENT_COMPLETED;
        this.paidAt = LocalDateTime.now();
    }

    /**
     * 2. [수정] 구매자가 직접 취소/환불 신청을 할 때 (승인 전/후 모두 가능하도록 개방)
     */
    public void cancelByUser() {
        if (this.status != ReservationStatus.PENDING &&
                this.status != ReservationStatus.PAYMENT_COMPLETED &&
                this.status != ReservationStatus.RESERVED) { // 💡 RESERVED(승인후) 상태에서도 취소 가능하도록 추가
            throw new IllegalStateException("사용자 취소 가능한 상태가 아닙니다. (현재 상태: " + this.status.getLabel() + ")");
        }

        // 결제가 안 된 미결제(PENDING) 상태면 그냥 단순 취소 처리
        if (this.paidAt == null) {
            this.status = ReservationStatus.USER_CANCELLED;
        } else {
            // 결제 이력이 있다면 환불 프로세스를 거쳐야 하므로 환불 완료 상태로 전이 유도
            this.status = ReservationStatus.REFUND_COMPLETED;
        }
    }

    /**
     * 3. [수정] 환불 원장 기록 시 엔티티 상태 검증 조건 동기화
     */
    public void refund() {
        // 결제 완료 상태나 호스트 승인 상태에서 환불이 와야 하므로 조건 전면 수정
        if (this.status != ReservationStatus.PAYMENT_COMPLETED &&
                this.status != ReservationStatus.RESERVED &&
                this.status != ReservationStatus.REFUND_COMPLETED) {
            throw new IllegalStateException("환불 처리가 가능한 상태가 아닙니다.");
        }
        if (this.paidAt == null) {
            throw new IllegalStateException("결제 이력이 없는 예약은 환불할 수 없습니다.");
        }
        this.status = ReservationStatus.REFUND_COMPLETED; // 최종 상태 확정
    }

    /**
     * 4. 판매자가 예약을 최종 승인할 때 ("예약 확정")
     */
    public void approveBySeller() {
        if (this.status != ReservationStatus.PAYMENT_COMPLETED) {
            throw new IllegalStateException("결제가 완료된 예약만 승인할 수 있습니다.");
        }
        this.status = ReservationStatus.RESERVED;
    }

    /**
     * 5. 판매자가 예약을 거절/취소할 때 ("판매자 취소")
     */
    public void cancelBySeller() {
        if (this.status != ReservationStatus.PAYMENT_COMPLETED && this.status != ReservationStatus.RESERVED) {
            throw new IllegalStateException("취소 가능한 예약 상태가 아닙니다.");
        }
        this.status = ReservationStatus.SELLER_CANCELLED;
    }

    /**
     * 6. 구매자가 예약을 온전히 이행 완료했을 때 ("이용 완료")
     */
    public void completeUsage() {
        if (this.status != ReservationStatus.RESERVED) {
            throw new IllegalStateException("확정된 예약 건만 이용 완료 처리가 가능합니다.");
        }
        this.status = ReservationStatus.COMPLETED;
    }

    // 외부 강제 변이용 서브 메서드 (유지)
    public void updateStatus(ReservationStatus status) {
        this.status = status;
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
        // 💡 결제 완료(PAYMENT_COMPLETED)와 예약 확정(RESERVED)이 모두 아닐 때만 예외 발생
        if (this.status != ReservationStatus.PAYMENT_COMPLETED && this.status != ReservationStatus.RESERVED) {

            // 1. 만약 예약 대기(PENDING) 상태라면 더 구체적인 안내 메시지 투척
            if (this.status == ReservationStatus.PENDING) {
                throw new IllegalStateException("결제 완료 이후에만 예약 정보를 수정할 수 있습니다.");
            }

            // 2. 그 외 취소나 이용 완료 등 수정이 완전히 불가능한 상태 처리
            throw new IllegalStateException("현재 상태에서는 예약 정보를 수정할 수 없습니다. (현재 상태: " + this.status.getLabel() + ")");
        }
    }
}