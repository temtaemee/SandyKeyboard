package com.kh.app.transaction.reservation.entity;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.transaction.reservation.dto.request.ReservationCreateReqDto;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    private MemberEntity member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private CouponEntity coupon;

    //    @ManyToOne(fetch = FetchType.LAZY)
    //    @JoinColumn
    //    private StayEntity stay;
    //
    //    @ManyToOne(fetch = FetchType.LAZY)
    //    @JoinColumn
    //    private OfficeEntity office;
///  /////////////////////////////

    private Long stayId;

    private Long officeId;
    /// //////////////////////////////////////

    @Column(nullable = false)
    private Integer guestCount;

    @Column(nullable = false, length = 100)
    private String reserverName;

    @Column(nullable = false)
    private LocalDateTime checkinDate;

    @Column(nullable = false)
    private LocalDateTime checkoutDate;

    @Column(nullable = false, length = 11)
    private String reserverPhone;

    @Column(nullable = false, length = 255)
    private String reserverEmail;

    @Column(nullable = false)
    private Long originalPrice;

    @Column(nullable = false)
    @Builder.Default
    private Long discountAmount = 0L;

    @Column(nullable = false)
    private Long totalPrice;

    @Column(nullable = false, length = 1)
    @Builder.Default
    private String reviewYn = "N";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReservationStatus status;

    public void approve() {
        this.status = ReservationStatus.APPROVED;
    }

    public void cancel() {
        this.status = ReservationStatus.CANCELLED;
    }

    public void reject() {
        this.status = ReservationStatus.REJECTED;
    }

    public void complete() {
        this.status = ReservationStatus.COMPLETED;
    }


    @PrePersist
    private void prePersist() {

        if (this.status == null) {
            this.status = ReservationStatus.PENDING;
        }

        validateTarget();
    }

    @PreUpdate
    private void validateTarget() {
        if (stayId == null && officeId == null) {
            throw new IllegalStateException("예약 대상이 없습니다.");
        }
    }


    public void update(ReservationCreateReqDto reqDto) {
        this.reserverName=reqDto.getReserverName();
        this.reserverPhone=reqDto.getReserverPhone();
        this.reserverEmail=reqDto.getReserverEmail();

    }
}