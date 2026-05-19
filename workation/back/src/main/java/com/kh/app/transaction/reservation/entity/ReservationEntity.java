package com.kh.app.transaction.reservation.entity;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.transaction.reservation.dto.request.ReservationCreateReqDto;
import com.kh.app.transaction.reservation.dto.request.ReservationUpdateReqDto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "RESERVATION")
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
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

    // 숙소 예약
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
    private LocalDateTime checkinDate;

    // 체크아웃
    @Column(nullable = false)
    private LocalDateTime checkoutDate;

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

    // =========================
    // 페이백 계좌 정보
    // =========================

    // 환급 은행명
    @Column(length = 50)
    private String refundBankName;

    // 환급 계좌번호
    @Column(length = 50)
    private String refundAccountNumber;

    // 예금주명
    @Column(length = 100)
    private String refundAccountHolder;

    // =========================
    // 상태 변경
    // =========================

    // 결제 완료
    public void completePayment() {

        if (this.status != ReservationStatus.PENDING) {
            throw new IllegalStateException("결제 가능한 상태가 아닙니다.");
        }

        this.status = ReservationStatus.PAYMENT_COMPLETED;
        this.paidAt = LocalDateTime.now();
    }

    // 사용자 취소
    public void cancelByUser() {

        if (
                this.status != ReservationStatus.PENDING &&
                        this.status != ReservationStatus.PAYMENT_COMPLETED
        ) {
            throw new IllegalStateException("사용자 취소 가능한 상태가 아닙니다.");
        }

        this.status = ReservationStatus.USER_CANCELLED;
    }

    // 판매자 취소
    public void cancelBySeller() {

        if (this.status != ReservationStatus.PAYMENT_COMPLETED) {
            throw new IllegalStateException("결제 완료 상태에서만 판매자 취소 가능.");
        }
        this.status = ReservationStatus.SELLER_CANCELLED;
    }

    // 판매자 예약 승인
    public void approveReservation() {

        if (this.status != ReservationStatus.PAYMENT_COMPLETED) {
            throw new IllegalStateException("예약 승인 가능한 상태가 아닙니다.");
        }

        this.status = ReservationStatus.RESERVED;
    }

    // 이용 완료
    public void complete() {

        if (this.status != ReservationStatus.RESERVED) {
            throw new IllegalStateException("이용 완료 처리 가능한 상태가 아닙니다.");
        }
        this.status = ReservationStatus.COMPLETED;
    }

    // 환불 완료
    public void refund() {

        if (
                this.status != ReservationStatus.USER_CANCELLED &&
                        this.status != ReservationStatus.SELLER_CANCELLED
        ) {
            throw new IllegalStateException("환불 가능한 상태가 아닙니다.");
        }

        if (this.paidAt == null) {
            throw new IllegalStateException("결제 이력이 없는 예약입니다.");
        }

        this.status = ReservationStatus.REFUND_COMPLETED;
    }

    // =========================
    // 엔티티 생성
    // =========================

    @PrePersist
    private void prePersist() {

        if (this.status == null) {
            this.status = ReservationStatus.PENDING;
        }

        this.createdAt = LocalDateTime.now();

        validateTarget();
    }

    @PreUpdate
    private void preUpdate() {
        validateTarget();
    }

    // =========================
    // 예약 대상 검증
    // =========================

    private void validateTarget() {

        if (stay == null) {
            throw new IllegalStateException("예약 대상이 없습니다.");
        }
    }

    // =========================
    // 예약자 정보 수정
    // =========================

    public void update(ReservationUpdateReqDto reqDto) {

        validateEditable();

        this.primaryGuestName = reqDto.getPrimaryGuestName();
        this.primaryGuestPhone = reqDto.getPrimaryGuestPhone();
        this.primaryGuestEmail = reqDto.getPrimaryGuestEmail();

        this.refundBankName = reqDto.getRefundBankName();
        this.refundAccountNumber = reqDto.getRefundAccountNumber();
        this.refundAccountHolder = reqDto.getRefundAccountHolder();
    }

    // 수정 가능 여부 검증
    private void validateEditable() {

        if (this.status != ReservationStatus.PENDING) {
            throw new IllegalStateException("수정 가능한 예약 상태가 아닙니다.");
        }
    }
}