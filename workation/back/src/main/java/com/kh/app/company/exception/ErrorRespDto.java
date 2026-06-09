package com.kh.app.company.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ErrorRespDto {

    private final String code;    // 에러코드 (ex. COMPANY-10001)
    private final String message;

}
