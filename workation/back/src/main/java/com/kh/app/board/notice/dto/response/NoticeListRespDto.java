package com.kh.app.board.notice.dto.response;

import com.kh.app.board.notice.entity.NoticeEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NoticeListRespDto {

    private Long id;
    private String title;
    private String writer;
    private LocalDateTime createdAt;
    private String pinYn;
    private String delYn; // admin용 삭제 여부

    public static NoticeListRespDto from(NoticeEntity entity) {
        return NoticeListRespDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .writer(entity.getMember().getUsername())
                .createdAt(entity.getCreatedAt())
                .pinYn(entity.getPinYn())
                .delYn(entity.getDelYn())
                .build();
    }
}