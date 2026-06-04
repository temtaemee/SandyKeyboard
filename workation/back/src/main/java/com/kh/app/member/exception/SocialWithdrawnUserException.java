package com.kh.app.member.exception;

import lombok.Getter;

@Getter
public class SocialWithdrawnUserException extends RuntimeException {
    private final String email;

    public SocialWithdrawnUserException(String message, String email) {
        super(message);
        this.email = email;
    }
}