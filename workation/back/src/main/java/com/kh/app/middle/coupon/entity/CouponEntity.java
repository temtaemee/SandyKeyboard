package com.kh.app.middle.coupon.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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
    @Column(length = 50 , nullable = false , unique = true)
    private String couponCode;
    @Column(length = 100 , nullable = false)
    private String couponName;
    @Column(nullable = false)
    private Integer discountValue;
    @Column(nullable = false)
    private Integer remainQty;

    @Column(nullable = false , length = 10)
    @Builder.Default
    private CouponStatus couponStatus = CouponStatus.A;

    private LocalDateTime expriedDate;
}
