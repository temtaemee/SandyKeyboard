package com.kh.app.board.review.dto.response;

import com.kh.app.board.review.entity.ReviewEntity;
import com.kh.app.board.review.entity.ReviewImageEntity;
import lombok.Builder;
import lombok.Getter;

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
    private LocalDateTime createdAt;
    private List<ReviewImageRespDto> images;

    public static ReviewRespDto from(ReviewEntity entity, List<ReviewImageEntity> images) {
        return ReviewRespDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .tag(entity.getTag())
                .rating(entity.getRating())
                .writer(entity.getMember().getUsername())
                .createdAt(entity.getCreatedAt())
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
