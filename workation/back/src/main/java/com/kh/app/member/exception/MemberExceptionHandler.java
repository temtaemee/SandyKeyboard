package com.kh.app.member.exception;

import com.kh.app.member.dto.response.SocialLoginErrorRespDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.NoSuchElementException;

@RestControllerAdvice(basePackages = "com.kh.app.member")
@Slf4j
public class MemberExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<SocialLoginErrorRespDto> handleDataIntegrity(DataIntegrityViolationException e) {
        log.warn("Member request failed due to invalid data", e);
        return badRequest("요청 값이 올바르지 않습니다.");
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class, NoSuchElementException.class})
    public ResponseEntity<SocialLoginErrorRespDto> handleBadRequest(RuntimeException e) {
        log.warn("Member request failed: {}", e.getMessage());
        return badRequest(resolveMessage(e));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<SocialLoginErrorRespDto> handleRuntime(RuntimeException e) {
        log.warn("Member request failed", e);
        return badRequest(resolveMessage(e));
    }

    private ResponseEntity<SocialLoginErrorRespDto> badRequest(String message) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(SocialLoginErrorRespDto.builder()
                        .result("fail")
                        .message(message)
                        .build());
    }

    private String resolveMessage(RuntimeException e) {
        String message = e.getMessage();
        return message == null || message.isBlank() ? "요청을 처리할 수 없습니다." : message;
    }
}
