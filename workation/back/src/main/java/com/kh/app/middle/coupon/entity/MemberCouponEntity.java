package com.kh.app.middle.coupon.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.transaction.payment.entity.PaymentEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "MEMBER_COUPON")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MemberCouponEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID")
    private MemberEntity memberId;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "COUPON_ID")
    private CouponEntity couponId;


//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "PAYMENT_ID")
//    private PaymentEntity paymentId;
    private Long paymentId;

    private String usedYn;
    private LocalDateTime usedAt;

    // 쿠폰 사용
    public void useCoupon() {
        usedYn = "Y";
        usedAt = LocalDateTime.now();
    }

    // 쿠폰 사용 여부 확인
    public boolean isUsed() {
        return "Y".equals(usedYn);
    }







}
