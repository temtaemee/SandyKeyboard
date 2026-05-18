package com.kh.app.product.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // SPACE
    SPACE_NOT_FOUND(4001, "SPACE-4001", "존재하지 않는 공간입니다.", HttpStatus.NOT_FOUND),
    UNIT_NOT_FOUND(4002, "SPACE-4002", "존재하지 않는 유닛입니다.", HttpStatus.NOT_FOUND),
    PRODUCT_NOT_FOUND(4003, "SPACE-4003", "존재하지 않는 상품입니다.", HttpStatus.NOT_FOUND),
    SPACE_ACCESS_DENIED(4004, "SPACE-4004", "본인 소유의 공간만 수정 가능합니다.", HttpStatus.FORBIDDEN),
    SPACE_HIDDEN(4005, "SPACE-4005", "비공개 처리된 공간입니다.", HttpStatus.BAD_REQUEST),
    PRODUCT_HIDDEN(4006, "SPACE-4006", "비공개 처리된 상품입니다.", HttpStatus.BAD_REQUEST),
    CAPACITY_EXCEEDED(4007, "SPACE-4007", "허용 인원을 초과했습니다.", HttpStatus.BAD_REQUEST),
    INVALID_DATE_RANGE(4008, "SPACE-4008", "날짜 범위가 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
    DUPLICATE_PRODUCT_NAME(4009, "SPACE-4009", "동일한 상품명이 존재합니다.", HttpStatus.CONFLICT),
    INVALID_PRICE(4010, "SPACE-4010", "금액 정보가 올바르지 않습니다.", HttpStatus.BAD_REQUEST),

    // STAY
    STAY_NOT_FOUND(5001, "STAY-5001", "존재하지 않는 숙소입니다.", HttpStatus.NOT_FOUND),

    // OFFICE
    OFFICE_NOT_FOUND(6001, "OFFICE-6001", "존재하지 않는 오피스입니다.", HttpStatus.NOT_FOUND),

    // FILE
    FILE_UPLOAD_FAILED(8001, "FILE-8001", "파일 업로드에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_FILE_TYPE(8002, "FILE-8002", "허용되지 않는 파일 형식입니다.", HttpStatus.BAD_REQUEST),
    FILE_SIZE_EXCEEDED(8003, "FILE-8003", "파일 크기 제한을 초과했습니다.", HttpStatus.BAD_REQUEST),
    FILE_NOT_FOUND(8004, "FILE-8004", "파일을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    ONLY_IMAGE_ALLOWED(8005, "FILE-8005", "이미지 파일만 업로드 가능합니다.", HttpStatus.BAD_REQUEST),

    // SYSTEM
    DB_ERROR(9998, "SYSTEM-9998", "데이터 처리 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    SYSTEM_ERROR(9999, "SYSTEM-9999", "서버 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);

    private final int code;
    private final String combineCode;
    private final String message;
    private final HttpStatus status;
}
