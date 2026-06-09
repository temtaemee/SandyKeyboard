package com.kh.app.transaction.reservation.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.product.stay.entity.StayEntity; // 💡 추가
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class ReservationCreateReqDto {

    private Long stayId;
    private Long couponId;
    private Integer guestCount;
    private String primaryGuestName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate checkinDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate checkoutDate;

    private String primaryGuestPhone;
    private String primaryGuestEmail;

    private String refundBankName;
    @Pattern(regexp = "^[0-9]{8,20}$", message = "계좌번호는 숫자만 입력 가능합니다.")
    private String refundAccountNumber;
    private String refundAccountHolder;

    public ReservationEntity toEntity(
            MemberEntity member,
            CouponEntity coupon,
            StayEntity stay, // 💡 StayEntity 객체로 변경
            String orderId,  // 💡 주문번호 함께 주입하도록 추가
            Long originalPrice,
            Long discountAmount,
            Long totalPrice
    ) {
        return ReservationEntity.builder()
                .member(member)
                .coupon(coupon)
                .stay(stay) // 💡 연관 관계 복구
                .orderId(orderId)
                .guestCount(guestCount)
                .primaryGuestName(primaryGuestName)
                .checkinDate(checkinDate)
                .checkoutDate(checkoutDate)
                .primaryGuestPhone(primaryGuestPhone)
                .primaryGuestEmail(primaryGuestEmail)
                .refundBankName(refundBankName)
                .refundAccountNumber(refundAccountNumber)
                .refundAccountHolder(refundAccountHolder)
                .originalPrice(originalPrice)
                .discountAmount(discountAmount)
                .totalPrice(totalPrice)
                .status(ReservationStatus.PENDING)
                .build();
    }
}