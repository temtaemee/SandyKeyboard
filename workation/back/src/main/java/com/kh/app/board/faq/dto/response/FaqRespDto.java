package com.kh.app.board.faq.dto.response;

import com.kh.app.board.faq.entity.FaqEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class FaqRespDto {

    private Long id;
    private String question;
    private String answer;
    private LocalDateTime createdAt;

    public static FaqRespDto from(FaqEntity entity) {
        return FaqRespDto.builder()
                .id(entity.getId())
                .question(entity.getQuestion())
                .answer(entity.getAnswer())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}