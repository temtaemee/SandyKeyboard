package com.kh.app.product.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@Slf4j
@RestControllerAdvice(basePackages = "com.kh.app.product")
public class ProductExceptionHandler {

    // 비즈니스 예외 (ProductException)
    @ExceptionHandler(ProductException.class)
    public ResponseEntity<ErrorResponse> handleProductException(ProductException e) {
        return ResponseEntity
                .status(e.getErrorCode().getStatus())
                .body(ErrorResponse.of(e.getErrorCode()));
    }

    // @Valid 검증 실패
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        List<ErrorResponse.FieldError> fieldErrors = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fe -> new ErrorResponse.FieldError(fe.getField(), fe.getDefaultMessage()))
                .toList();

        return ResponseEntity
                .badRequest()
                .body(ErrorResponse.ofValidation(fieldErrors));
    }

    // JSON 파싱 실패 (잘못된 enum 값, 타입 불일치 등)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleNotReadable(HttpMessageNotReadableException e) {
        log.warn("요청 바디 파싱 실패: {}", e.getMessage());
        return ResponseEntity
                .badRequest()
                .body(ErrorResponse.ofMessage("요청 형식이 올바르지 않습니다. 입력값을 확인해주세요."));
    }

    // DB 제약 조건 위반 (중복 키, FK 오류 등)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException e) {
        log.warn("DB 제약 조건 위반: {}", e.getMessage());
        return ResponseEntity
                .status(ErrorCode.DB_ERROR.getStatus())
                .body(ErrorResponse.of(ErrorCode.DB_ERROR));
    }

    // 예상치 못한 예외
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        log.error("처리되지 않은 예외 발생", e);
        return ResponseEntity
                .status(ErrorCode.SYSTEM_ERROR.getStatus())
                .body(ErrorResponse.of(ErrorCode.SYSTEM_ERROR));
    }
}
