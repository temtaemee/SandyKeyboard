package com.kh.app.middle.event.dto.resp;

import com.kh.app.middle.event.entity.EventEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class EventRespDto {

    private Long id;
    private String title;
    private String content;
    private String writerUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static EventRespDto from(EventEntity entity) {
        return EventRespDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .writerUsername(entity.getMember().getUsername())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
