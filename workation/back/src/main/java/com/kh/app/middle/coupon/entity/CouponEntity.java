package com.kh.app.middle.coupon.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.middle.coupon.dto.request.CouponCreateDto;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "COUPON")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class CouponEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50, nullable = false, unique = true)
    private String couponCode;

    @Column(length = 100, nullable = false)
    private String couponName;

    @Column(nullable = false)
    private Integer discountRate;

    @Column(nullable = false)
    private Integer remainQty;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private CouponStatus couponStatus = CouponStatus.A;

    private Integer validDays;

    public void update(CouponCreateDto dto) {
        if (dto.getCouponName() != null) couponName = dto.getCouponName();
        if (dto.getDiscountRate() != null) discountRate = dto.getDiscountRate();
        if (dto.getRemainQty() != null) remainQty = dto.getRemainQty();
        if (dto.getValidDays() != null) validDays = dto.getValidDays();
    }

    public void decrementQty() {
        if (this.remainQty <= 0) {
            throw new IllegalStateException("[COUPON-7004] 쿠폰 수량이 모두 소진되었습니다.");
        }
        this.remainQty--;
        if (this.remainQty == 0) {
            this.couponStatus = CouponStatus.X;
        }
    }

    public void restoreQty() {
        if (this.remainQty < 0) {
            throw new IllegalStateException("[COUPON-7005] 쿠폰 수량이 음수입니다.");
        }
        this.remainQty++;
        if(this.couponStatus == CouponStatus.X) {
            this.couponStatus = CouponStatus.A;
        }
    }

}
