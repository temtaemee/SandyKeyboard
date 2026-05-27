package com.kh.app.transaction.reservation.dto.response;

import com.kh.app.product.space.dto.response.SpaceResDto;
import com.kh.app.product.stay.dto.response.StayResDto;
import com.kh.app.transaction.payment.entity.PaymentEntity;
import com.kh.app.transaction.reservation.entity.ReservationEntity;
import com.kh.app.transaction.reservation.entity.ReserveFileEntity;
import lombok.Builder;
import lombok.Getter;
import org.apache.tomcat.jni.FileInfo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ReservationDetailResDto {

    // 1. 예약 기본 정보
    private Long id;
    private Long memberId;
    private Integer guestCount;
    private String primaryGuestName;
    private String primaryGuestPhone;
    private String primaryGuestEmail;
    private LocalDate checkinDate;
    private LocalDate checkoutDate;
    private Long originalPrice;
    private Long discountAmount;
    private Long totalPrice;
    private String status;
    private String statusLabel;
    private LocalDateTime createdAt;

    // 2. 💡 요구사항: 공간(Space) 정보 객체 통째로 포함
    private SpaceResDto space;

    // 3. 💡 요구사항: 숙소(Stay) 정보 객체 통째로 포함 (사진, 옵션 연동 규격)
    private StayResDto stay;

    // 4. 💡 요구사항: 실시간 결제 정보 포함
    private PaymentInfo payment;

    // 💡 5.  첨부파일 목록 정보
    private List<FileInfo> files;

    @Getter
    @Builder
    public static class PaymentInfo {
        private String orderId;
        private String paymentMethod;
        private String paymentStatus;
        private Long amount;
        private String cardCompany;
        private String cardNumber;
        private LocalDateTime approvedAt;
    }

    // 💡  파일 정보를 프론트에 내려줄 구조
    @Getter
    @Builder
    public static class FileInfo {
        private Long id;
        private String originalFileName;
        private String fileUrl; // S3 전체 주소
    }

    // =========================================================================
    // 💡 팩토리 메서드로 모든 도메인 데이터 한방에 조립
    // =========================================================================
    public static ReservationDetailResDto of(
            ReservationEntity entity,
            SpaceResDto spaceResDto,
            StayResDto stayResDto,
            PaymentEntity paymentEntity,
            List<ReserveFileEntity> reserveFiles, // 추가
            com.kh.app.aws.service.S3Service s3Service // 추가 (URL 변환용)
    ) {
        // 결제 정보 매핑
        PaymentInfo paymentInfo = null;
        if (paymentEntity != null) {
            paymentInfo = PaymentInfo.builder()
                    .orderId(paymentEntity.getOrderId())
                    .paymentMethod(paymentEntity.getPaymentMethod() != null ? paymentEntity.getPaymentMethod().name() : null)
                    .paymentStatus(paymentEntity.getStatus() != null ? paymentEntity.getStatus().name() : null)
                    .amount(paymentEntity.getAmount())
                    .cardCompany(paymentEntity.getCardCompany())
                    .cardNumber(paymentEntity.getCardNumber())
                    .approvedAt(paymentEntity.getApprovedAt())
                    .build();
        }

        // 💡 첨부파일 정보 매핑 (s3Service를 이용해 완전한 URL 생성)
        List<FileInfo> fileInfoList = null;
        if (reserveFiles != null) {
            fileInfoList = reserveFiles.stream()
                    .map(file -> FileInfo.builder()
                            .id(file.getID())
                            .originalFileName(file.getOriginalFileName())
                            .fileUrl(s3Service.getFileUrl(file.getS3Key())) // s3Key -> URL 변환
                            .build())
                    .toList();
        }

        return ReservationDetailResDto.builder()
                .id(entity.getId())
                .memberId(entity.getMember() != null ? entity.getMember().getId() : null)
                .guestCount(entity.getGuestCount())
                .primaryGuestName(entity.getPrimaryGuestName())
                .primaryGuestPhone(entity.getPrimaryGuestPhone())
                .primaryGuestEmail(entity.getPrimaryGuestEmail())
                .checkinDate(entity.getCheckinDate())
                .checkoutDate(entity.getCheckoutDate())
                .originalPrice(entity.getOriginalPrice())
                .discountAmount(entity.getDiscountAmount())
                .totalPrice(entity.getTotalPrice())
                .status(entity.getStatus() != null ? entity.getStatus().name() : null)
                .statusLabel(entity.getStatus() != null ? entity.getStatus().getLabel() : null)
                .createdAt(entity.getCreatedAt())

                .space(spaceResDto)
                .stay(stayResDto)
                .payment(paymentInfo)
                .files(fileInfoList) // 💡 파일 목록 주입
                .build();
    }
}