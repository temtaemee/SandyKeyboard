package com.kh.app.transaction.reservation.entity;

import com.kh.app.member.entity.MemberEntity;
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

    //    @ManyToOne(fetch = FetchType.LAZY)
    //    @JoinColumn
    //    private CouponEntity coupon;
    //
    //    @ManyToOne(fetch = FetchType.LAZY)
    //    @JoinColumn(nullable = false)
    //    private StayEntity stay;
    //
    //    @ManyToOne(fetch = FetchType.LAZY)
    //    @JoinColumn(nullable = false)
    //    private OfficeEntity office;
///  /////////////////////////////
    private Long couponId;

    @Column(nullable = false)
    private Long stayId;

    @Column(nullable = false)
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

    @Column(nullable = false, length = 50)
    private String status;

    public void complete() {
        this.status = "COMPLETED";
    }

    public void cancel() {
        this.status = "CANCELLED";
    }

    public void markReviewed() {
        this.reviewYn = "Y";
    }
}