package com.kh.app.member.exception;

import lombok.Getter;

@Getter
public class SocialLinkRequiredException extends RuntimeException {

    private final String email;
    private final String socialId;
    private final String provider;

    public SocialLinkRequiredException(
            String email,
            String socialId,
            String provider
    ) {
        super("기존 계정과 연동이 필요합니다.");
        this.email = email;
        this.socialId = socialId;
        this.provider = provider;
    }
}