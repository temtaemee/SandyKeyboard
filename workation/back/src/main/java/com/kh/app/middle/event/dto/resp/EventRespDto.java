package com.kh.app.middle.event.dto.resp;

import com.kh.app.middle.event.entity.EventEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class EventRespDto {

    private Long id;
    private String title;
    private String content;
    private String writerUsername;
    private String delYn;
    private Long couponId;
    private String couponName;
    private Integer couponDiscountRate;
    private Integer couponRemainQty;
    private Integer couponValidDays;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static EventRespDto from(EventEntity entity) {
        var coupon = entity.getCoupon();
        return EventRespDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .writerUsername(entity.getMember().getUsername())
                .delYn(entity.getDelYn())
                .couponId(coupon != null ? coupon.getId() : null)
                .couponName(coupon != null ? coupon.getCouponName() : null)
                .couponDiscountRate(coupon != null ? coupon.getDiscountRate() : null)
                .couponRemainQty(coupon != null ? coupon.getRemainQty() : null)
                .couponValidDays(coupon != null ? coupon.getValidDays() : null)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
