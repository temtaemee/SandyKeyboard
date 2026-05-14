package com.kh.app.transaction.reservation.dto.request;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.product.office.entity.OfficeEntity;
import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class ReservationCreateReqDto {

    private Long couponId;

    private Integer guestCount;

    private String reserverName;

    private LocalDateTime checkinDate;

    private LocalDateTime checkoutDate;

    private String reserverPhone;

    private String reserverEmail;

    public ReservationEntity toEntity(
            MemberEntity member,
            CouponEntity coupon,
            StayEntity stay,
            OfficeEntity office,
            Long originalPrice,
            Long discountAmount,
            Long totalPrice
    ) {

        return ReservationEntity.builder()
                .member(member)
                .coupon(coupon)
                .stay(stay)
                .office(office)
                .guestCount(guestCount)
                .reserverName(reserverName)
                .checkinDate(checkinDate)
                .checkoutDate(checkoutDate)
                .reserverPhone(reserverPhone)
                .reserverEmail(reserverEmail)
                .originalPrice(originalPrice)
                .discountAmount(discountAmount)
                .totalPrice(totalPrice)
                .status(ReservationStatus.PENDING)
                .build();
    }
}