package com.kh.app.member.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KakaoLoginReqDto {
    private String code; // 리액트가 던져줄 카카오 인가 코드
}