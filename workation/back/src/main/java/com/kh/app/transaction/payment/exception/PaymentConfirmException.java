package com.kh.app.transaction.payment.exception;

import lombok.Getter;

@Getter
public class PaymentConfirmException extends RuntimeException {

    private final int statusCode;
    private final String providerBody;

    public PaymentConfirmException(int statusCode, String message) {
        this(statusCode, message, null);
    }

    public PaymentConfirmException(int statusCode, String message, String providerBody) {
        super(message);
        this.statusCode = statusCode;
        this.providerBody = providerBody;
    }
}
