package com.kh.app.member.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Member 에러 코드 (2001 ~ 2008)
    DUPLICATE_USERNAME(2001, "MEMBER-2001", "이미 사용중인 아이디입니다.", HttpStatus.BAD_REQUEST),
    DUPLICATE_EMAIL(2002, "MEMBER-2002", "이미 사용중인 이메일입니다.", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD_FORMAT(2003, "MEMBER-2003", "비밀번호 형식이 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
    PASSWORD_MISMATCH(2004, "MEMBER-2004", "비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST),
    MEMBER_NOT_FOUND(2005, "MEMBER-2005", "존재하지 않는 회원입니다.", HttpStatus.NOT_FOUND),
    WITHDRAWN_MEMBER(2006, "MEMBER-2006", "탈퇴한 회원입니다.", HttpStatus.GONE),
    INVALID_PHONE_FORMAT(2007, "MEMBER-2007", "전화번호 형식이 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL_FORMAT(2008, "MEMBER-2008", "이메일 형식이 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
    
    // Seller 에러 코드 (3001)
    ALREADY_SELLER_APPLIED(3001, "SELLER-3001", "이미 판매자 신청이 완료되었습니다.", HttpStatus.BAD_REQUEST),
    SELLER_NOT_FOUND(3001, "MEMBER-3001", "존재하지 않는 판매자입니다.", HttpStatus.NOT_FOUND),

    // Wishlist / Space 에러 코드 (4004, 4011)
    WISHLIST_ACCESS_DENIED(4004, "SPACE-4004", "삭제 권한 없음", HttpStatus.FORBIDDEN),
    DUPLICATE_WISHLIST(4011, "SPACE-4011", "이미 찜한 공간입니다.", HttpStatus.BAD_REQUEST),
    SPACE_NOT_FOUND(4001, "SPACE-4001", "존재하지 않는 공간입니다.", HttpStatus.NOT_FOUND),

    // System 공통 에러
    SYSTEM_ERROR(9999, "SYSTEM-9999", "서버 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);

    private final int code;
    private final String combineCode;
    private final String message;
    private final HttpStatus status;
}
