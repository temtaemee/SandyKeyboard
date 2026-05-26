package com.kh.app.member.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class SocialLoginRespDto {
    private String token; // 발행된 서비스 전용 JWT 토큰
    @JsonProperty("isNewUser")
    private boolean isNewUser;   // 신규 소셜 가입자 여부 (true면 프론트에서 추가 프로필 폼으로 리다이렉트)
    private String email;        // 신규 가입자일 경우 리액트 가입 폼에 미리 채워줄 이메일
}