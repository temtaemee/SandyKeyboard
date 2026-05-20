package com.kh.app.middle.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice(basePackages = "com.kh.app.middle")
public class MiddleExceptionHandler {

    @ExceptionHandler(MiddleException.class)
    public ResponseEntity<ErrorRespDto> handleCustomException(MiddleException e){
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
