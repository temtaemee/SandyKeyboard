package com.kh.app.member.exception;

import com.kh.app.member.dto.response.SocialLoginErrorRespDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice(basePackages = {"com.kh.app.member", "com.kh.app.mypage"})
@Slf4j
public class MemberExceptionHandler {

    @ExceptionHandler(MemberException.class)
    public ResponseEntity<Map<String, Object>> handleMemberException(MemberException e) {
        log.warn("MemberException occurred: {}", e.getMessage());
        ErrorCode errorCode = e.getErrorCode();
        Map<String, Object> body = Map.of(
                "code", errorCode.getCode(),
                "combineCode", errorCode.getCombineCode(),
                "message", e.getMessage(),
                "result", "fail"
        );
        return ResponseEntity.status(errorCode.getStatus()).body(body);
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateEmail(DuplicateEmailException e) {
        log.warn("DuplicateEmailException occurred: {}", e.getMessage());
        Map<String, Object> body = Map.of(
                "code", 2002,
                "combineCode", "MEMBER-2002",
                "message", e.getMessage(),
                "result", "fail"
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrity(DataIntegrityViolationException e) {
        log.warn("DataIntegrityViolationException occurred", e);
        Map<String, Object> body = Map.of(
                "code", 9998,
                "combineCode", "SYSTEM-9998",
                "message", "요청 값이 올바르지 않습니다.",
                "result", "fail"
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class, NoSuchElementException.class})
    public ResponseEntity<Map<String, Object>> handleBadRequest(RuntimeException e) {
        log.warn("Member bad request: {}", e.getMessage());
        Map<String, Object> body = Map.of(
                "code", 9999,
                "combineCode", "SYSTEM-9999",
                "message", resolveMessage(e),
                "result", "fail"
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(SocialWithdrawnUserException.class)
    public ResponseEntity<SocialLoginErrorRespDto> handleSocialWithdrawnUser(SocialWithdrawnUserException e) {
        log.warn("SocialWithdrawnUserException occurred: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(SocialLoginErrorRespDto.builder()
                        .result("fail")
                        .message(e.getMessage())
                        .email(e.getEmail())
                        .build());
    }

    @ExceptionHandler(SocialLinkRequiredException.class)
    public ResponseEntity<SocialLoginErrorRespDto> handleSocialLinkRequired(SocialLinkRequiredException e) {
        log.warn("SocialLinkRequiredException occurred: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(SocialLoginErrorRespDto.builder()
                        .result("fail")
                        .message("소셜 연동이 필요합니다.")
                        .email(e.getEmail())
                        .socialId(e.getSocialId())
                        .provider(e.getProvider())
                        .build());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntime(RuntimeException e) {
        log.warn("Member runtime request failed", e);
        Map<String, Object> body = Map.of(
                "code", 9999,
                "combineCode", "SYSTEM-9999",
                "message", resolveMessage(e),
                "result", "fail"
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    private String resolveMessage(RuntimeException e) {
        String message = e.getMessage();
        return message == null || message.isBlank() ? "요청을 처리할 수 없습니다." : message;
    }
}
