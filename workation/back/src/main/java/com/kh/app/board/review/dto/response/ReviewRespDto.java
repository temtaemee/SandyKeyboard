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
public class ReviewRespDto {

    private Long id;
    private String title;
    private String content;
    private String tag;
    private Integer rating;
    private String writer;
    private String hideYn;    // 관리자 숨김 여부
    private LocalDateTime createdAt;
    private List<ReviewImageRespDto> images;

    // 다녀온 곳 정보 추가
    private String stayName;
    private LocalDate checkinDate;
    private LocalDate checkoutDate;

    public static ReviewRespDto from(ReviewEntity entity, List<ReviewImageEntity> images) {
        String stayName = null;
        LocalDate checkin = null;
        LocalDate checkout = null;
        if (entity.getReservation() != null && entity.getReservation().getStay() != null) {
            stayName = entity.getReservation().getStay().getName();
            checkin = entity.getReservation().getCheckinDate();
            checkout = entity.getReservation().getCheckoutDate();
        }

        return ReviewRespDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .tag(entity.getTag())
                .rating(entity.getRating())
                .writer(entity.getMember().getUsername())
                .hideYn(entity.getHideYn())
                .createdAt(entity.getCreatedAt())
                .stayName(stayName)
                .checkinDate(checkin)
                .checkoutDate(checkout)
                .images(images.stream().map(ReviewImageRespDto::from).toList())
                .build();
    }

    @Getter
    @Builder
    public static class ReviewImageRespDto {
        private Long id;
        private String originalFileName;
        private String s3Key;

        public static ReviewImageRespDto from(ReviewImageEntity img) {
            return ReviewImageRespDto.builder()
                    .id(img.getId())
                    .originalFileName(img.getOriginalFileName())
                    .s3Key(img.getS3Key())
                    .build();
        }
    }
}
