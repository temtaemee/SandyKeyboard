package com.kh.app.board.review.dto.response;

import com.kh.app.board.review.entity.CommentEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommentRespDto {

    private Long id;
    private String writer;
    private String content;
    private Integer rating;
    private String ownerYn;
    private LocalDateTime createdAt;

    public static CommentRespDto from(CommentEntity entity) {
        return CommentRespDto.builder()
                .id(entity.getId())
                .writer(entity.getMember().getUsername())
                .content(entity.getContent())
                .rating(entity.getRating())
                .ownerYn(entity.getOwnerYn())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}