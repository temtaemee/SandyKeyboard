package com.kh.app.transaction.reservation.dto.response;

import com.kh.app.transaction.reservation.entity.ReservationEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReservationResDto {

    private Long id;

    private Long memberId;

    private Long stayId;

    private Long officeId;

    private Integer guestCount;

    private String primaryGuestName;

    private LocalDateTime checkinDate;

    private LocalDateTime checkoutDate;

    private String primaryGuestPhone;

    private String primaryGuestEmail;

    private Long totalPrice;

    // enum name
    private String status;

    // 한글 라벨
    private String statusLabel;

    public static ReservationResDto from(
            ReservationEntity entity
    ) {

        return ReservationResDto.builder()

                .id(entity.getId())

                .memberId(
                        entity.getMember().getId()
                )

                .stayId(
                        entity.getStay() != null
                                ? entity.getStay().getId()
                                : null
                )

                .guestCount(
                        entity.getGuestCount()
                )

                .primaryGuestName(
                        entity.getPrimaryGuestName()
                )

                .checkinDate(
                        entity.getCheckinDate()
                )

                .checkoutDate(
                        entity.getCheckoutDate()
                )

                .primaryGuestPhone(
                        entity.getPrimaryGuestPhone()
                )

                .primaryGuestEmail(
                        entity.getPrimaryGuestEmail()
                )

                .totalPrice(
                        entity.getTotalPrice()
                )

                .status(
                        entity.getStatus().name()
                )

                .statusLabel(
                        entity.getStatus().getLabel()
                )

                .build();
    }
}