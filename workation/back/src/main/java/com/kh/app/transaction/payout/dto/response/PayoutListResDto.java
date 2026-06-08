package com.kh.app.transaction.payout.dto.response;

import com.kh.app.transaction.payout.entity.PayoutEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PayoutListResDto {
    private Long payoutId;
    private String sellerUsername;
    private Long originalAmount;
    private Long feeAmount;
    private Long payoutAmount;
    private String statusLabel;
    private LocalDateTime payoutDate;

    public static PayoutListResDto from(PayoutEntity entity) {
        return PayoutListResDto.builder()
                .payoutId(entity.getId())
                .sellerUsername(entity.getSeller().getUsername())
                .originalAmount(entity.getOriginalAmount())
                .feeAmount(entity.getFeeAmount())
                .payoutAmount(entity.getPayoutAmount())
                .statusLabel(entity.getStatus().name()) // 프로젝트 Enum 규격 출력
                .payoutDate(entity.getPayoutDate())
                .build();
    }
}