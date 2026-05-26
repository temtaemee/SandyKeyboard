package com.kh.app.board.notice.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoticeUpdateReqDto {

    private String title;
    private String content;
    private String pinYn = "N"; // 공지 고정 여부 (기본값: N)
}