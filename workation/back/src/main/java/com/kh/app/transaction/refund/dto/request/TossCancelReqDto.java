package com.kh.app.transaction.refund.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class TossCancelReqDto {
    private String cancelReason; // 💡 토스 측에는 한글 문자열로 넘겨야 하므로 reason.getDescription()을 넣을 예정입니다.
    private Long cancelAmount;   // 전액 취소 시 값을 채우지 않거나 전체 금액을 세팅합니다.
}