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
    private String reserverName;

    private LocalDateTime checkinDate;
    private LocalDateTime checkoutDate;

    private String reserverPhone;
    private String reserverEmail;

    private Long totalPrice;

    private String status;

    public static ReservationResDto from(
            ReservationEntity entity
    ) {

        return ReservationResDto.builder()
                .id(entity.getId())
                .memberId(entity.getMember().getId())
                .stayId(entity.getStay().getId())
                .officeId(entity.getOffice().getId())
                .guestCount(entity.getGuestCount())
                .reserverName(entity.getReserverName())
                .checkinDate(entity.getCheckinDate())
                .checkoutDate(entity.getCheckoutDate())
                .reserverPhone(entity.getReserverPhone())
                .reserverEmail(entity.getReserverEmail())
                .totalPrice(entity.getTotalPrice())
                .status(entity.getStatus().name())
                .build();
    }
}