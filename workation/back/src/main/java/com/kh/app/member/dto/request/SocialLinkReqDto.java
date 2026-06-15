package com.kh.app.member.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SocialLinkReqDto {
    private String provider; // KAKAO, NAVER, GOOGLE
    private String email;
    private String socialId;
}
