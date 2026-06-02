package com.kh.app.product.space.repository;

import com.kh.app.member.entity.QMemberEntity;
import com.kh.app.product.space.dto.request.SpaceSearchReqDto;
import com.kh.app.product.space.entity.QSpaceArcadeEntity;
import com.kh.app.product.space.entity.QSpaceEntity;
import com.kh.app.product.space.entity.SpaceEntity;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Repository
public class SpaceRepositoryImpl implements SpaceRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<SpaceEntity> searchList(SpaceSearchReqDto dto) {
        QSpaceEntity space = QSpaceEntity.spaceEntity;
        QMemberEntity member = QMemberEntity.memberEntity;

        return queryFactory
                .selectFrom(space)
                .leftJoin(space.seller, member).fetchJoin()
                .where(
                        space.delYn.eq("N"),
                        keywordContains(space, dto.getKeyword()),
                        areaEq(space, dto),
                        visibleYnEq(space, dto.getVisibleYn())
                )
                .orderBy(space.createdAt.desc())
                .fetch();
    }

    @Override
    public List<SpaceEntity> searchListForPublic(SpaceSearchReqDto dto) {
        QSpaceEntity space = QSpaceEntity.spaceEntity;
        QMemberEntity member = QMemberEntity.memberEntity;

        List<BooleanExpression> conditions = new ArrayList<>();
        conditions.add(space.delYn.eq("N"));
        conditions.add(space.visibleYn.eq("Y"));

        BooleanExpression keyword = keywordContains(space, dto.getKeyword());
        if (keyword != null) conditions.add(keyword);

        BooleanExpression area = areaEq(space, dto);
        if (area != null) conditions.add(area);

        BooleanExpression allArcades = hasAllArcades(space, dto.getArcadeIds());
        if (allArcades != null) conditions.add(allArcades);

        return queryFactory
                .selectFrom(space)
                .leftJoin(space.seller, member).fetchJoin()
                .where(conditions.toArray(new BooleanExpression[0]))
                .orderBy(space.createdAt.desc())
                .fetch();
    }

    @Override
    public List<SpaceEntity> searchListForSeller(Long memberId) {
        QSpaceEntity space = QSpaceEntity.spaceEntity;
        QMemberEntity member = QMemberEntity.memberEntity;

        return queryFactory
                .selectFrom(space)
                .leftJoin(space.seller, member).fetchJoin()
                .where(
                        space.seller.id.eq(memberId)
                )
                .orderBy(space.createdAt.desc())
                .fetch();
    }

    @Override
    public List<SpaceEntity> searchListForAdmin(SpaceSearchReqDto dto) {
        QSpaceEntity space = QSpaceEntity.spaceEntity;
        QMemberEntity member = QMemberEntity.memberEntity;

        return queryFactory
                .selectFrom(space)
                .leftJoin(space.seller, member).fetchJoin()
                .where(
                        keywordContains(space, dto.getKeyword()),
                        areaEq(space, dto),
                        visibleYnEq(space, dto.getVisibleYn()),
                        delYnEq(space, dto.getDelYn())
                )
                .orderBy(space.createdAt.desc())
                .fetch();
    }

    // 스페이스가 요청한 편의시설을 모두 보유하는지 확인 (AND 조건)
    private BooleanExpression hasAllArcades(QSpaceEntity space, List<Long> arcadeIds) {
        if (CollectionUtils.isEmpty(arcadeIds)) return null;

        QSpaceArcadeEntity spaceArcade = QSpaceArcadeEntity.spaceArcadeEntity;

        return space.id.in(
                JPAExpressions
                        .select(spaceArcade.space.id)
                        .from(spaceArcade)
                        .where(spaceArcade.arcade.id.in(arcadeIds))
                        .groupBy(spaceArcade.space.id)
                        .having(spaceArcade.arcade.id.count().goe((long) arcadeIds.size()))
        );
    }

    private BooleanExpression keywordContains(QSpaceEntity space, String keyword) {
        if (!StringUtils.hasText(keyword)) return null;
        return space.name.containsIgnoreCase(keyword);
    }

    private BooleanExpression areaEq(QSpaceEntity space, SpaceSearchReqDto dto) {
        if (dto.getArea() == null) return null;
        return space.area.eq(dto.getArea());
    }

    private BooleanExpression visibleYnEq(QSpaceEntity space, String visibleYn) {
        if (!StringUtils.hasText(visibleYn)) return null;
        return space.visibleYn.eq(visibleYn);
    }

    private BooleanExpression delYnEq(QSpaceEntity space, String delYn) {
        if (!StringUtils.hasText(delYn)) return null;
        return space.delYn.eq(delYn);
    }
}
