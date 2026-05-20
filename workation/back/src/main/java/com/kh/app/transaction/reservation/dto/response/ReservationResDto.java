package com.kh.app.transaction.reservation.dto.response;

import com.kh.app.transaction.reservation.entity.ReservationEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class ReservationResDto {

    private Long id;

    private Long memberId;

    private Long stayId;

    private Integer guestCount;

    private String primaryGuestName;

    private LocalDate checkinDate;

    private LocalDate checkoutDate;

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
/// ////////////////////////////////////////////////////////////
                //스테이 완료후 수정
//                .stayId(
//                        entity.getStay() != null
//                                ? entity.getStay().getId()
//                                : null
//                )
                .stayId(entity.getStayId())
/// ////////////////////////////////////////////////////////////
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