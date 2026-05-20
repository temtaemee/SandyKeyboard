package com.kh.app.board.review.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LikeRespDto {
    private boolean liked;   // 현재 로그인 유저가 좋아요 눌렀는지
    private long count;      // 총 좋아요 수
}