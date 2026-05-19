package com.kh.app.middle.coupon.repository;

import com.kh.app.member.entity.QMemberEntity;
import com.kh.app.middle.coupon.entity.CouponStatus;
import com.kh.app.middle.coupon.entity.MemberCouponEntity;
import com.kh.app.middle.coupon.entity.QCouponEntity;
import com.kh.app.middle.coupon.entity.QMemberCouponEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class MemberCouponRepositoryImpl implements MemberCouponRepositoryCustom{

    private final JPAQueryFactory queryFactory;
    private final static QMemberCouponEntity q = QMemberCouponEntity.memberCouponEntity;
    private final static QCouponEntity cq = QCouponEntity.couponEntity;
    private final static QMemberEntity mq = QMemberEntity.memberEntity;

    @Override
    public Page<MemberCouponEntity> getCouponList(Long memberId, Pageable pageable) {
        List<MemberCouponEntity> list = queryFactory
                .selectFrom(q)
                .join(q.member, mq).fetchJoin()
                .join(q.couponId, cq).fetchJoin()
                .where(
                        q.member.id.eq(memberId),
                        q.usedYn.eq("N"),
                        cq.couponStatus.eq(CouponStatus.A)
                )
                .orderBy(q.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(q.count())
                .from(q)
                .join(q.couponId, cq)
                .where(
                        q.member.id.eq(memberId),
                        q.usedYn.eq("N"),
                        cq.couponStatus.eq(CouponStatus.A)
                )
                .fetchOne();

        return new PageImpl<>(list, pageable, total);
    }
}
