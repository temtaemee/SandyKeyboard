package com.kh.app.product.exception;

import java.util.List;

public record ErrorResponse(
        int code,
        String combineCode,
        String message,
        List<FieldError> errors
) {
    public record FieldError(String field, String reason) {}

    public static ErrorResponse of(ErrorCode errorCode) {
        return new ErrorResponse(
                errorCode.getCode(),
                errorCode.getCombineCode(),
                errorCode.getMessage(),
                List.of()
        );
    }

    public static ErrorResponse ofValidation(List<FieldError> errors) {
        return new ErrorResponse(9999, "SYSTEM-9999", "입력값을 확인해주세요.", errors);
    }

    public static ErrorResponse ofMessage(String message) {
        return new ErrorResponse(0, "", message, List.of());
    }
}
