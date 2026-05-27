package com.kh.app.transaction.reservation.dto.response;

import com.kh.app.transaction.reservation.entity.ReservationEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class ReservationResDto {

    private Long id;
    private Long memberId;
    private Long stayId;
    private String stayName;          // 💡 화면에 보여줄 숙소명 필드 추가

    private Integer guestCount;
    private String primaryGuestName;

    private LocalDate checkinDate;
    private LocalDate checkoutDate;

    private String primaryGuestPhone;
    private String primaryGuestEmail;

    private Long totalPrice;
    private String status;            // enum name (PENDING, PAYMENT_COMPLETED 등)
    private String statusLabel;       // 한글 라벨 (예약 대기, 결제 완료 등)


    public static ReservationResDto from(ReservationEntity entity) {
        // 💡 널 포인터 예외(NPE)를 방지하기 위한 안전한 숙소 정보 추출
        Long extractedStayId = null;
        String extractedStayName = null;

        if (entity.getStay() != null) {
            extractedStayId = entity.getStay().getId();
            extractedStayName = entity.getStay().getName(); // 💡 StayEntity의 name 필드 가져오기
        }

        return ReservationResDto.builder()
                .id(entity.getId())
                .memberId(entity.getMember() != null ? entity.getMember().getId() : null)

                // 💡 임시 stayId 대신 객체 그래프 탐색 구조로 변경 완료
                .stayId(extractedStayId)
                .stayName(extractedStayName)

                .guestCount(entity.getGuestCount())
                .primaryGuestName(entity.getPrimaryGuestName())
                .checkinDate(entity.getCheckinDate())
                .checkoutDate(entity.getCheckoutDate())
                .primaryGuestPhone(entity.getPrimaryGuestPhone())
                .primaryGuestEmail(entity.getPrimaryGuestEmail())
                .totalPrice(entity.getTotalPrice())

                .status(entity.getStatus() != null ? entity.getStatus().name() : null)
                .statusLabel(entity.getStatus() != null ? entity.getStatus().getLabel() : null)
                .build();
    }
}