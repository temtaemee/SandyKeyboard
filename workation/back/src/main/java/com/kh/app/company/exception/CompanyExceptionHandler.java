package com.kh.app.company.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice(basePackages = "com.kh.app.company")
public class CompanyExceptionHandler {

    @ExceptionHandler(CompanyException.class)
    public ResponseEntity<ErrorRespDto> handleCustomException(CompanyException e){
        ErrorCode errorCode = e.getErrorCode();
        return ResponseEntity
                .status( errorCode.getStatus() )
                .body(new ErrorRespDto( errorCode.getMessage() ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorRespDto> handleException(Exception e){
        log.error("예상치 못한 예외 발생" , e);
        return ResponseEntity
                .internalServerError()
                .body(new ErrorRespDto(e.getMessage()));
    }
}
