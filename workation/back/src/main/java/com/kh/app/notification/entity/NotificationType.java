package com.kh.app.notification.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NotificationType {
    RESERVATION_COMPLETE("예약 완료"),
    RESERVATION_CANCEL("예약 취소"),
    RESERVATION_REMINDER("예약 일정 안내"),

    PAYMENT_SUCCESS("결제 성공"),
    PAYMENT_FAIL("결제 실패"),
    REFUND_COMPLETE("환불 완료"),

    COUPON_ISSUED("쿠폰 발급"),
    COUPON_EXPIRED("쿠폰 만료"),

    REVIEW_REQUEST("리뷰 요청"),

    SPACE_PENDING("상품 심사 대기"),
    SPACE_APPROVED("상품 승인"),
    SPACE_REJECTED("상품 반려"),
    SPACE_HIDDEN_BY_ADMIN("관리자 비노출 처리"),
    SPACE_VISIBLE_BY_ADMIN("관리자 노출 복구"),

    COMPANY_ENROLL("파트너사 등록"),
    COMPANY_ACTIVE("파트너사 활성화"),
    COMPANY_DEACTIVATE("파트너사 비활성화")
    ;

    private final String description;
}
