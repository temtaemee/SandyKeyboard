package com.kh.app.middle.apply.repository;

import com.kh.app.member.entity.QMemberEntity;
import com.kh.app.middle.apply.dto.resp.SpaceApplyRespDto;
import com.kh.app.middle.apply.entity.ApplyStatus;
import com.kh.app.middle.apply.entity.QSpaceApplyEntity;
import com.kh.app.middle.apply.entity.SpaceApplyEntity;
import com.kh.app.product.space.entity.QSpaceEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class SpaceApplyRepositoryImpl implements SpaceApplyRepositoryCustom{

    private final QSpaceApplyEntity q = QSpaceApplyEntity.spaceApplyEntity;
    private final QMemberEntity m = QMemberEntity.memberEntity;
    private final QSpaceEntity s = QSpaceEntity.spaceEntity;
    private final JPAQueryFactory queryFactory;

    @Override
    public boolean existsPendingApply(Long memberId, Long spaceId) {

        Integer result = queryFactory
                .selectOne()
                .from(q)
                .where(
                        q.seller.id.eq(memberId),
                        q.space.id.eq(spaceId),
                        q.applyStatus.eq(ApplyStatus.P)
                )
                .fetchFirst();

        return result != null;
    }

    //목록조회
    @Override
    public Page<SpaceApplyEntity> getList(Pageable pageable) {
        List<SpaceApplyEntity> applyList = queryFactory
                .selectFrom(q)
                .join(q.seller, m).fetchJoin()
                .join(q.space, s).fetchJoin()
                .orderBy(q.id.desc())
                .offset(pageable.getOffset()) // 몇 번째 데이터부터 가져올지
                .limit(pageable.getPageSize()) // 몇 개 가져올지
                .fetch();

        Long total = queryFactory
                .select(q.count())
                .from(q)
                .fetchOne();

        return new PageImpl<>(applyList, pageable, total);

    }
}
