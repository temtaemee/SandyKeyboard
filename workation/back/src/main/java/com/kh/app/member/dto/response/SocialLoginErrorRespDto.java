package com.kh.app.member.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SocialLoginErrorRespDto {
    private final String result;   // "fail" 고정
    private final String message;  // "탈퇴 처리된 계정입니다."
    private final String email;    // "abc@naver.com" (복구용 이메일)
    private final String socialId;
    private final String provider;

}