package com.kh.app.product.stay.repository;

import com.kh.app.product.stay.dto.request.StaySearchReqDto;
import com.kh.app.product.stay.entity.QStayEntity;
import com.kh.app.product.stay.entity.QStayOptionEntity;
import com.kh.app.product.stay.entity.StayEntity;
import com.kh.app.product.stay.entity.StayOption;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.List;

@RequiredArgsConstructor
@Repository
public class StayRepositoryImpl implements StayRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<StayEntity> searchList(StaySearchReqDto dto) {
        QStayEntity stay = QStayEntity.stayEntity;

        return queryFactory
                .selectFrom(stay)
                .join(stay.space).fetchJoin()
                .where(
                        stay.delYn.eq("N"),
                        keywordContains(stay, dto.getKeyword()),
                        spaceIdEq(stay, dto.getSpaceId()),
                        workationYnEq(stay, dto.getWorkationYn()),
                        areaEq(stay, dto),
                        minPriceLoe(stay, dto.getMinPrice()),
                        maxPriceGoe(stay, dto.getMaxPrice()),
                        capacityGoe(stay, dto.getCapacity()),
                        optionsIn(stay, dto.getOptions())
                )
                .orderBy(stay.createdAt.desc())
                .fetch();
    }

    @Override
    public List<StayEntity> searchListForPublic(StaySearchReqDto dto) {
        QStayEntity stay = QStayEntity.stayEntity;

        return queryFactory
                .selectFrom(stay)
                .join(stay.space).fetchJoin()
                .where(
                        stay.delYn.eq("N"),
                        stay.visibleYn.eq("Y"),
                        keywordContains(stay, dto.getKeyword()),
                        spaceIdEq(stay, dto.getSpaceId()),
                        workationYnEq(stay, dto.getWorkationYn()),
                        areaEq(stay, dto),
                        minPriceLoe(stay, dto.getMinPrice()),
                        maxPriceGoe(stay, dto.getMaxPrice()),
                        capacityGoe(stay, dto.getCapacity()),
                        optionsIn(stay, dto.getOptions())
                )
                .orderBy(stay.createdAt.desc())
                .fetch();
    }

    @Override
    public List<StayEntity> searchMyStays(Long memberId) {
        QStayEntity stay = QStayEntity.stayEntity;

        return queryFactory
                .selectFrom(stay)
                .join(stay.space).fetchJoin()
                .where(
                        stay.space.seller.id.eq(memberId)
                )
                .orderBy(stay.createdAt.desc())
                .fetch();
    }

    @Override
    public List<StayEntity> searchListForAdmin(StaySearchReqDto dto) {
        QStayEntity stay = QStayEntity.stayEntity;

        return queryFactory
                .selectFrom(stay)
                .join(stay.space).fetchJoin()
                .where(
                        keywordContains(stay, dto.getKeyword()),
                        spaceIdEq(stay, dto.getSpaceId()),
                        workationYnEq(stay, dto.getWorkationYn()),
                        areaEq(stay, dto),
                        minPriceLoe(stay, dto.getMinPrice()),
                        maxPriceGoe(stay, dto.getMaxPrice()),
                        capacityGoe(stay, dto.getCapacity()),
                        optionsIn(stay, dto.getOptions()),
                        visibleYnEq(stay, dto.getVisibleYn()),
                        delYnEq(stay, dto.getDelYn())
                )
                .orderBy(stay.createdAt.desc())
                .fetch();
    }

    private BooleanExpression keywordContains(QStayEntity stay, String keyword) {
        if (!StringUtils.hasText(keyword)) return null;
        return stay.name.containsIgnoreCase(keyword);
    }

    private BooleanExpression spaceIdEq(QStayEntity stay, Long spaceId) {
        if (spaceId == null) return null;
        return stay.space.id.eq(spaceId);
    }

    private BooleanExpression workationYnEq(QStayEntity stay, String workationYn) {
        if (!StringUtils.hasText(workationYn)) return null;
        return stay.workationYn.eq(workationYn);
    }

    private BooleanExpression areaEq(QStayEntity stay, StaySearchReqDto dto) {
        if (dto.getArea() == null) return null;
        return stay.space.area.eq(dto.getArea());
    }

    private BooleanExpression visibleYnEq(QStayEntity stay, String visibleYn) {
        if (!StringUtils.hasText(visibleYn)) return null;
        return stay.visibleYn.eq(visibleYn);
    }

    private BooleanExpression delYnEq(QStayEntity stay, String delYn) {
        if (!StringUtils.hasText(delYn)) return null;
        return stay.delYn.eq(delYn);
    }

    // monPrice ~ sunPrice 중 최솟값 >= minPrice
    private BooleanExpression minPriceLoe(QStayEntity stay, Integer minPrice) {
        if (minPrice == null) return null;
        return Expressions.numberTemplate(Integer.class,
                "LEAST({0},{1},{2},{3},{4},{5},{6})",
                stay.monPrice, stay.tuePrice, stay.wedPrice, stay.thuPrice,
                stay.friPrice, stay.satPrice, stay.sunPrice
        ).goe(minPrice);
    }

    // monPrice ~ sunPrice 중 최솟값 <= maxPrice
    private BooleanExpression maxPriceGoe(QStayEntity stay, Integer maxPrice) {
        if (maxPrice == null) return null;
        return Expressions.numberTemplate(Integer.class,
                "LEAST({0},{1},{2},{3},{4},{5},{6})",
                stay.monPrice, stay.tuePrice, stay.wedPrice, stay.thuPrice,
                stay.friPrice, stay.satPrice, stay.sunPrice
        ).loe(maxPrice);
    }

    private BooleanExpression capacityGoe(QStayEntity stay, Integer capacity) {
        if (capacity == null) return null;
        return stay.capacity.goe(capacity);
    }

    private BooleanExpression optionsIn(QStayEntity stay, List<StayOption> options) {
        if (CollectionUtils.isEmpty(options)) return null;
        QStayOptionEntity stayOption = QStayOptionEntity.stayOptionEntity;
        return stay.id.in(
                JPAExpressions
                        .select(stayOption.stay.id)
                        .from(stayOption)
                        .where(stayOption.stayOption.in(options))
                        .groupBy(stayOption.stay.id)
                        .having(stayOption.stay.id.count().goe(options.size()))
        );
    }
}
