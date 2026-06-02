package com.kh.app.transaction.reservation.dto.response;

import com.kh.app.member.entity.MemberProfileEntity;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class ReservationAdminListResDto {

    private Long id;                  // 예약 번호 (PK)
    private String orderId;           // 토스페이먼츠 주문 번호
    private Long memberId;            // 회원 고유 번호
    private String username;          // 예약자 계정 아이디
    private String memberName;        // 예약자 실명
    private String memberPhone;       // 예약자 연락처
    private Long stayId;              // 숙소 고유 번호

    private Integer guestCount;       // 인원수
    private String primaryGuestName;  // 대표 예약자명
    private String primaryGuestPhone; // 대표 예약자 연락처
    private String primaryGuestEmail; // 대표 예약자 이메일

    private LocalDate checkinDate;    // 체크인 날짜
    private LocalDate checkoutDate;   // 체크아웃 날짜
    private Long totalPrice;          // 최종 결제 금액

    private String status;            // 예약 상태 Enum Name
    private String statusLabel;       // 예약 상태 한글 라벨
    private LocalDateTime createdAt;  // 예약 신청 일시

    private String refundBankName;       // 환급 은행명
    private String refundAccountNumber;  // 환급 계좌번호
    private String refundAccountHolder;  // 예금주명

    private String stayName;  // 💡 숙소명
    private String spaceName; // 💡 장소(공간)명

    /**
     * 엔티티 데이터를 DTO로 안전하게 변환하는 매핑 메서드
     */
    public static ReservationAdminListResDto from(ReservationEntity entity) {
        return from(entity, null);
    }

    public static ReservationAdminListResDto from(ReservationEntity entity, MemberProfileEntity profile) {

        // 💡 널 포인터 예외(NPE)를 방지하면서 안전하게 상위 객체의 이름 추출
        String extractedStayName = null;
        String extractedSpaceName = null;

        if (entity.getStay() != null) {
            extractedStayName = entity.getStay().getName(); // 숙소명 추출

            // 숙소(Stay)가 소속된 공간(Space)의 이름 추출
            if (entity.getStay().getSpace() != null) {
                extractedSpaceName = entity.getStay().getSpace().getName();
            }
        }

        return ReservationAdminListResDto.builder()
                .id(entity.getId())
                .orderId(entity.getOrderId())
                .memberId(entity.getMember() != null ? entity.getMember().getId() : null)
                .username(entity.getMember() != null ? entity.getMember().getUsername() : null)
                .memberName(profile != null ? profile.getName() : null)
                .memberPhone(profile != null ? profile.getPhone() : null)
                .stayId(entity.getStay() != null ? entity.getStay().getId() : null)
                .guestCount(entity.getGuestCount())
                .primaryGuestName(entity.getPrimaryGuestName())
                .primaryGuestPhone(entity.getPrimaryGuestPhone())
                .primaryGuestEmail(entity.getPrimaryGuestEmail())
                .checkinDate(entity.getCheckinDate())
                .checkoutDate(entity.getCheckoutDate())
                .totalPrice(entity.getTotalPrice())
                .status(entity.getStatus() != null ? entity.getStatus().name() : null)
                .statusLabel(entity.getStatus() != null ? entity.getStatus().getLabel() : null)
                .createdAt(entity.getCreatedAt())
                .refundBankName(entity.getRefundBankName())
                .refundAccountNumber(entity.getRefundAccountNumber())
                .refundAccountHolder(entity.getRefundAccountHolder())
                // 💡 [추가] 추출한 동적 필드 바인딩 완성
                .stayName(extractedStayName)
                .spaceName(extractedSpaceName)
                .build();
    }
}