package com.kh.app.middle.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class MiddleException extends RuntimeException {

    private final ErrorCode errorCode;


}
