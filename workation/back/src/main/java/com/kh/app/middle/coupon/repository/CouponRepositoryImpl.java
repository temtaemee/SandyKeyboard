package com.kh.app.middle.coupon.repository;

import com.kh.app.middle.coupon.entity.CouponEntity;
import com.kh.app.middle.coupon.entity.QCouponEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.kh.app.middle.coupon.entity.QCouponEntity.couponEntity;

@Repository
@RequiredArgsConstructor
public class CouponRepositoryImpl implements CouponRepositoryCustom{

    private final JPAQueryFactory queryFactory;
    private static final QCouponEntity c = QCouponEntity.couponEntity;

    @Override
    public Page<CouponEntity> getList(Pageable pageable) {
        List<CouponEntity> couponList = queryFactory
            .selectFrom(c)
            .orderBy(c.id.desc())
            .offset(pageable.getOffset())
            .limit(pageable.getPageSize())
            .fetch();

        Long total = queryFactory
            .select(c.count())
            .from(c)
            .fetchOne();

        return new PageImpl<>(couponList, pageable, total);


    }
}
