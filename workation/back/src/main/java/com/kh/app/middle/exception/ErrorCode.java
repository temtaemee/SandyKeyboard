package com.kh.app.middle.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    //member (2001 ~ 2099)
    DUPLICATE_USERNAME(2001, "MEMBER-2001", "이미 사용중인 아이디입니다.", HttpStatus.CONFLICT),
    DUPLICATE_EMAIL(2002, "MEMBER-2002", "이미 사용중인 이메일입니다.", HttpStatus.CONFLICT),
    INVALID_PASSWORD_FORMAT(2003, "MEMBER-2003", "비밀번호 형식이 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
    PASSWORD_MISMATCH(2004, "MEMBER-2004", "비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST),
    MEMBER_NOT_FOUND(2005, "MEMBER-2005", "존재하지 않는 회원입니다.", HttpStatus.NOT_FOUND),
    WITHDRAWN_MEMBER(2006, "MEMBER-2006", "탈퇴한 회원입니다.", HttpStatus.BAD_REQUEST),
    INVALID_PHONE_FORMAT(2007, "MEMBER-2007", "전화번호 형식이 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL_FORMAT(2008, "MEMBER-2008", "이메일 형식이 올바르지 않습니다.", HttpStatus.BAD_REQUEST),

    //space (4001 ~ 4099)
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
    DUPLICATE_APPLY(4011, "SPACE-4011", "동일한 정보의 신청 건이 존재합니다.", HttpStatus.CONFLICT),
    APPLY_NOT_FOUND(4012, "SPACE-4012", "존재하지 않는 신청 건 입니다.", HttpStatus.NOT_FOUND),

    //coupon (7001 ~ 7099)
    USED_COUPON(7001, "COUPON-7001", "이미 사용된 쿠폰입니다.", HttpStatus.BAD_REQUEST),
    NOT_EXIST_COUPON(7002, "COUPON-7002", "존재하지 않는 쿠폰입니다.", HttpStatus.BAD_REQUEST),
    EXPIRED_COUPON(7003, "COUPON-7003", "만료된 쿠폰입니다.", HttpStatus.BAD_REQUEST),
    COUPON_QUANTITY_EXHAUSTED(7004, "COUPON-7004", "쿠폰 수량이 모두 소진되었습니다.", HttpStatus.BAD_REQUEST),
    INVALID_COUPON_CONDITION(7005, "COUPON-7005", "사용 조건에 맞지 않는 쿠폰입니다.", HttpStatus.BAD_REQUEST),
    DUPLICATE_COUPON_ISSUE(7006, "COUPON-7006", "이미 발급받은 쿠폰입니다.", HttpStatus.BAD_REQUEST),
    COUPON_OWNER_RESTRICTION(7007, "COUPON-7007", "본인의 쿠폰만 사용 가능합니다.", HttpStatus.BAD_REQUEST);




    private final int code;
    private final String combineCode;
    private final String message;
    private final HttpStatus status;
}
