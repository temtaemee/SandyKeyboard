package com.kh.app.company.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // company (10001 ~ 10099)
    COMPANY_NOT_FOUND(10001, "COMPANY-10001", "존재하지 않는 기업입니다.", HttpStatus.NOT_FOUND),
    DUPLICATE_COMPANY(10002, "COMPANY-10002", "이미 등록된 기업입니다.", HttpStatus.CONFLICT),
    DUPLICATE_BUSINESS_NO(10003, "COMPANY-10003", "이미 사용중인 사업자번호입니다.", HttpStatus.CONFLICT),
    INVALID_BUSINESS_NO(10004, "COMPANY-10004", "사업자번호 형식이 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
    DELETED_COMPANY(10005, "COMPANY-10005", "탈퇴한 기업입니다.", HttpStatus.GONE),
    COMPANY_ACCESS_DENIED(10006, "COMPANY-10006", "기업 정보 수정 권한이 없습니다.", HttpStatus.FORBIDDEN),
    ALREADY_HAS_COMPANY(10007, "COMPANY-10007", "이미 소속된 기업이 있습니다.", HttpStatus.CONFLICT),
    COMPANY_NOT_ASSIGNED(10008, "COMPANY-10008", "소속된 기업이 없습니다.", HttpStatus.NOT_FOUND);

    private final int code;
    private final String combineCode;
    private final String message;
    private final HttpStatus status;
}
