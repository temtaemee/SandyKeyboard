package com.kh.app.company.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // company 에러 코드 (10001 ~ 10099)
    COMPANY_NOT_FOUND(10001, "COMPANY-10001", "존재하지 않는 기업입니다.", HttpStatus.NOT_FOUND),           // 해당 id의 기업이 없는 경우
    DUPLICATE_COMPANY(10002, "COMPANY-10002", "이미 등록된 기업입니다.", HttpStatus.CONFLICT),             // 동일한 기업명이 이미 존재하는 경우
    DUPLICATE_BUSINESS_NO(10003, "COMPANY-10003", "이미 사용중인 사업자번호입니다.", HttpStatus.CONFLICT), // 동일한 사업자번호가 이미 존재하는 경우
    INVALID_BUSINESS_NO(10004, "COMPANY-10004", "사업자번호 형식이 올바르지 않습니다.", HttpStatus.BAD_REQUEST), // 사업자번호 형식이 맞지 않는 경우
    DELETED_COMPANY(10005, "COMPANY-10005", "탈퇴한 기업입니다.", HttpStatus.GONE),                        // delYn = 'Y' 인 비활성 기업에 접근한 경우
    COMPANY_ACCESS_DENIED(10006, "COMPANY-10006", "기업 정보 수정 권한이 없습니다.", HttpStatus.FORBIDDEN), // 수정 권한이 없는 경우
    ALREADY_HAS_COMPANY(10007, "COMPANY-10007", "이미 소속된 기업이 있습니다.", HttpStatus.CONFLICT),      // 이미 기업에 소속된 회원이 재등록 시도하는 경우
    COMPANY_NOT_ASSIGNED(10008, "COMPANY-10008", "소속된 기업이 없습니다.", HttpStatus.NOT_FOUND);         // 소속 기업이 없는 회원이 기업 관련 기능을 요청하는 경우

    private final int code;
    private final String combineCode;
    private final String message;
    private final HttpStatus status;
}
