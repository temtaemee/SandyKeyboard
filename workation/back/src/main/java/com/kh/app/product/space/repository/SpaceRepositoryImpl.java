package com.kh.app.product.space.repository;

import com.kh.app.board.review.entity.QReviewEntity;
import com.kh.app.member.entity.QMemberEntity;
import com.kh.app.product.space.dto.request.SpaceSearchReqDto;
import com.kh.app.product.space.entity.Area;
import com.kh.app.product.space.entity.QSpaceEntity;
import com.kh.app.product.space.entity.SpaceEntity;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

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

        return queryFactory
                .selectFrom(space)
                .leftJoin(space.seller, member).fetchJoin()
                .where(
                        space.delYn.eq("N"),
                        space.visibleYn.eq("Y"),
                        keywordContains(space, dto.getKeyword()),
                        areaEq(space, dto)
                )
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
    @Override
    public List<SpaceEntity> findRecommendedSpaces(Area area) {
        QSpaceEntity space = QSpaceEntity.spaceEntity;
        QReviewEntity review = QReviewEntity.reviewEntity;

        return queryFactory
                .selectFrom(space)
                // 💡 review.space를 직접 조인 (가장 안전한 방식)
                .innerJoin(review).on(review.space.eq(space))
                .where(
                        space.visibleYn.eq("Y"),
                        area != null ? space.area.eq(area) : null
                )
                .groupBy(space.id)
                .having(review.rating.avg().goe(4.0))
                // 💡 여기서 에러가 난다면 review.createdAt 대신에 review.id.max()를 사용해보세요.
                // 최신 리뷰일수록 ID값이 클 확률이 높기 때문입니다.
                .orderBy(review.id.max().desc())
                .limit(3)
                .fetch();
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
