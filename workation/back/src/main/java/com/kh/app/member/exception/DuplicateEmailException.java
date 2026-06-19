package com.kh.app.member.exception;

// 이메일 중복 시 던질 커스텀 예외
public class DuplicateEmailException extends RuntimeException {
    public DuplicateEmailException(String message) {
        super(message);
    }
}