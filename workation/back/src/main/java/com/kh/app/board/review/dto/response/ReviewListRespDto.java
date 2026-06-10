package com.kh.app.board.review.dto.response;

import com.kh.app.board.review.entity.ReviewEntity;
import com.kh.app.board.review.entity.ReviewImageEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ReviewListRespDto {

    private Long id;
    private String title;
    private String content;   // 목록에서 본문 바로 표시
    private String tag;
    private String writer;
    private Integer rating;
    private String hideYn;    // 관리자 숨김 여부
    private LocalDateTime createdAt;
    private List<ImageDto> images;

    // 다녀온 곳 정보 추가
    private String stayName;
    private LocalDate checkinDate;
    private LocalDate checkoutDate;

    // 이미지 정보
    @Getter
    @Builder
    public static class ImageDto {
        private Long id;
        private String originalFileName;
        private String s3Key;

        public static ImageDto from(ReviewImageEntity img) {
            return ImageDto.builder()
                    .id(img.getId())
                    .originalFileName(img.getOriginalFileName())
                    .s3Key(img.getS3Key())
                    .build();
        }
    }

    // 이미지 없이 목록만 만들 때
    public static ReviewListRespDto from(ReviewEntity entity) {
        String stayName = null;
        LocalDate checkin = null;
        LocalDate checkout = null;
        if (entity.getReservation() != null && entity.getReservation().getStay() != null) {
            stayName = entity.getReservation().getStay().getName();
            checkin = entity.getReservation().getCheckinDate();
            checkout = entity.getReservation().getCheckoutDate();
        }

        return ReviewListRespDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .tag(entity.getTag())
                .writer(entity.getMember().getUsername())
                .rating(entity.getRating())
                .hideYn(entity.getHideYn())
                .createdAt(entity.getCreatedAt())
                .stayName(stayName)
                .checkinDate(checkin)
                .checkoutDate(checkout)
                .images(List.of())
                .build();
    }

    // 이미지 포함 버전
    public static ReviewListRespDto from(ReviewEntity entity, List<ReviewImageEntity> images) {
        String stayName = null;
        LocalDate checkin = null;
        LocalDate checkout = null;
        if (entity.getReservation() != null && entity.getReservation().getStay() != null) {
            stayName = entity.getReservation().getStay().getName();
            checkin = entity.getReservation().getCheckinDate();
            checkout = entity.getReservation().getCheckoutDate();
        }

        return ReviewListRespDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .tag(entity.getTag())
                .writer(entity.getMember().getUsername())
                .rating(entity.getRating())
                .hideYn(entity.getHideYn())
                .createdAt(entity.getCreatedAt())
                .stayName(stayName)
                .checkinDate(checkin)
                .checkoutDate(checkout)
                .images(images.stream().map(ImageDto::from).toList())
                .build();
    }
}
