package com.kh.app.company.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class CompanyException extends RuntimeException {

    private final ErrorCode errorCode;


}
