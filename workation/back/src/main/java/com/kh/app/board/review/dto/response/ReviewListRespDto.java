package com.kh.app.board.review.dto.response;

import com.kh.app.board.review.entity.ReviewEntity;
import com.kh.app.board.review.entity.ReviewImageEntity;
import lombok.Builder;
import lombok.Getter;

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
    private LocalDateTime createdAt;
    private List<ImageDto> images;

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
        return ReviewListRespDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .tag(entity.getTag())
                .writer(entity.getMember().getUsername())
                .rating(entity.getRating())
                .createdAt(entity.getCreatedAt())
                .images(List.of())
                .build();
    }

    // 이미지 포함 버전
    public static ReviewListRespDto from(ReviewEntity entity, List<ReviewImageEntity> images) {
        return ReviewListRespDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .tag(entity.getTag())
                .writer(entity.getMember().getUsername())
                .rating(entity.getRating())
                .createdAt(entity.getCreatedAt())
                .images(images.stream().map(ImageDto::from).toList())
                .build();
    }
}