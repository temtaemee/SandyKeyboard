package com.kh.app.transaction.reservation.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class ReservationCreateReqDto {

    // 쿠폰 ID
    private Long couponId;

    // 인원수
    private Integer guestCount;

    // 대표 예약자 이름
    private String primaryGuestName;

    // 체크인
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime checkinDate;

    // 체크아웃
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime checkoutDate;

    // 대표 예약자 전화번호
    private String primaryGuestPhone;

    // 대표 예약자 이메일
    private String primaryGuestEmail;

    // =========================
    // 환불 계좌 정보
    // =========================

    private String refundBankName;

    private String refundAccountNumber;

    private String refundAccountHolder;

    public ReservationEntity toEntity(
            MemberEntity member,
            CouponEntity coupon,
            StayEntity stay,
            Long originalPrice,
            Long discountAmount,
            Long totalPrice
    ) {

        return ReservationEntity.builder()

                .member(member)
                .coupon(coupon)
                .stay(stay)

                .guestCount(guestCount)

                .primaryGuestName(primaryGuestName)

                .checkinDate(checkinDate)
                .checkoutDate(checkoutDate)

                .primaryGuestPhone(primaryGuestPhone)
                .primaryGuestEmail(primaryGuestEmail)

                // 환불 계좌 정보
                .refundBankName(refundBankName)
                .refundAccountNumber(refundAccountNumber)
                .refundAccountHolder(refundAccountHolder)

                // 금액 정보
                .originalPrice(originalPrice)
                .discountAmount(discountAmount)
                .totalPrice(totalPrice)

                // 기본 예약 상태
                .status(ReservationStatus.PENDING)

                .build();
    }
}
