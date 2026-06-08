package com.kh.app.transaction.refund.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RefundReason {

    SIMPLE_CHANGE("단순변심"),
    SCHEDULE_CHANGE("일정변경"),
    PRODUCT_CHANGE("상품변경"),
    METHOD_CHANGE("결제수단변경");

    private final String description;
}