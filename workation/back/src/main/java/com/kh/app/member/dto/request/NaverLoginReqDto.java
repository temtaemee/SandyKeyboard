package com.kh.app.member.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NaverLoginReqDto {
    private String code;  // 네이버 인가 코드
    private String state; // 네이버 상태 토큰
}