package com.kh.app.board.notice.dto.response;

import com.kh.app.board.notice.entity.NoticeEntity;
import com.kh.app.board.notice.entity.NoticeFileEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class NoticeRespDto {

    private Long id;
    private String title;
    private String content;
    private String writer;
    private LocalDateTime createdAt;
    private String pinYn;
    private String delYn; // admin용 삭제 여부
    private List<NoticeFileRespDto> files;

    public static NoticeRespDto from(NoticeEntity entity, List<NoticeFileEntity> files) {
        return NoticeRespDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .writer(entity.getMember().getUsername())
                .createdAt(entity.getCreatedAt())
                .pinYn(entity.getPinYn())
                .delYn(entity.getDelYn())
                .files(files.stream().map(NoticeFileRespDto::from).toList())
                .build();
    }

    @Getter
    @Builder
    public static class NoticeFileRespDto {
        private Long id;
        private String originalFileName;
        private String s3Key;

        public static NoticeFileRespDto from(NoticeFileEntity file) {
            return NoticeFileRespDto.builder()
                    .id(file.getId())
                    .originalFileName(file.getOriginalFileName())
                    .s3Key(file.getS3Key())
                    .build();
        }
    }
}