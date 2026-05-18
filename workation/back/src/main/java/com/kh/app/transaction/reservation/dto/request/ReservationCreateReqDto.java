package com.kh.app.transaction.reservation.dto.request;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.product.office.entity.OfficeEntity;
import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import lombok.Getter;
import lombok.Setter;


import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

@Setter
@Getter
public class ReservationCreateReqDto {

    private Long couponId;

    private Integer guestCount;

    private String primaryGuestName;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime checkinDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime checkoutDate;

    private String primaryGuestPhone;

    private String primaryGuestEmail;

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
                .primaryGuestName(primaryGuestName)
                .checkinDate(checkinDate)
                .checkoutDate(checkoutDate)
                .primaryGuestPhone(primaryGuestPhone)
                .primaryGuestEmail(primaryGuestEmail)
                .originalPrice(originalPrice)
                .discountAmount(discountAmount)
                .totalPrice(totalPrice)
                .status(ReservationStatus.PENDING)
                .build();
    }
}