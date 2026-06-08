package com.kh.app.security.exception;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.AuthenticationException;

public class WithdrawnUserException extends AuthenticationException {
    public WithdrawnUserException(@Nullable String msg, Throwable cause) {
        super(msg, cause);
    }
    public WithdrawnUserException(String msg) {
        super(msg);
    }
}
