package com.kh.app.product.space.repository;

import com.kh.app.board.review.entity.QReviewEntity;
import com.kh.app.member.entity.QMemberEntity;
import com.kh.app.product.space.dto.request.SpaceSearchReqDto;
import com.kh.app.product.space.entity.Area;
import com.kh.app.product.space.entity.QSpaceArcadeEntity;
import com.kh.app.product.space.entity.QSpaceEntity;
import com.kh.app.product.space.entity.SpaceEntity;
import com.kh.app.product.stay.entity.QStayEntity;
import com.kh.app.transaction.reservation.entity.QReservationEntity;
import com.kh.app.transaction.reservation.entity.ReservationStatus;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
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

        // 편의시설 AND 필터
        BooleanExpression arcades = hasAllArcades(space, dto.getArcadeIds());
        if (arcades != null) conditions.add(arcades);

        // 날짜/인원 기준 이용 가능한 스테이 보유 여부
        BooleanExpression available = hasAvailableStay(space, dto.getStartDate(), dto.getEndDate(), dto.getCapacity());
        if (available != null) conditions.add(available);

        return queryFactory
                .selectFrom(space)
                .leftJoin(space.seller, member).fetchJoin()
                .where(conditions.toArray(new BooleanExpression[0]))
                .orderBy(space.createdAt.desc())
                .fetch();
    }

    // 편의시설을 모두 보유한 공간 (AND 조건)
    private BooleanExpression hasAllArcades(QSpaceEntity space, List<Long> arcadeIds) {
        if (CollectionUtils.isEmpty(arcadeIds)) return null;
        QSpaceArcadeEntity sa = QSpaceArcadeEntity.spaceArcadeEntity;
        return space.id.in(
                JPAExpressions.select(sa.space.id).from(sa)
                        .where(sa.arcade.id.in(arcadeIds))
                        .groupBy(sa.space.id)
                        .having(sa.arcade.id.count().goe((long) arcadeIds.size()))
        );
    }

    // 날짜/인원 조건에 맞는 예약 가능한 스테이를 보유한 공간
    private BooleanExpression hasAvailableStay(QSpaceEntity space, LocalDate startDate, LocalDate endDate, Integer capacity) {
        if (startDate == null && endDate == null && capacity == null) return null;
        QStayEntity stay = QStayEntity.stayEntity;
        BooleanExpression cond = stay.delYn.eq("N").and(stay.visibleYn.eq("Y"));

        if (capacity != null) cond = cond.and(stay.capacity.goe(capacity));

        if (startDate != null && endDate != null) {
            QReservationEntity rsv = QReservationEntity.reservationEntity;

            // 💡 수정: 예약 불가능으로 간주할 상태를 명시적으로 지정
            // PENDING은 여기에 포함되지 않으므로 예약이 있어도 검색 결과에 나옵니다.
            cond = cond.and(stay.id.notIn(
                    JPAExpressions.select(rsv.stay.id).from(rsv)
                            .where(rsv.checkinDate.lt(endDate), rsv.checkoutDate.gt(startDate),
                                    rsv.status.in(
                                            ReservationStatus.PAYMENT_COMPLETED,
                                            ReservationStatus.RESERVED,
                                            ReservationStatus.COMPLETED
                                    ))
            ));
        }
        return space.id.in(JPAExpressions.select(stay.space.id).from(stay).where(cond));
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
