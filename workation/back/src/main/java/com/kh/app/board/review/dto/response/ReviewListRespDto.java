package com.kh.app.board.review.dto.response;

import com.kh.app.board.review.entity.ReviewEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReviewListRespDto {

    private Long id;
    private String title;
    private String writer;
    private Integer rating;
    private LocalDateTime createdAt;

    public static ReviewListRespDto from(ReviewEntity entity) {
        return ReviewListRespDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .writer(entity.getMember().getUsername())
                .rating(entity.getRating())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
