package com.kh.app.middle.event.repository;

import com.kh.app.middle.event.entity.EventEntity;
import com.kh.app.middle.event.entity.QEventEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class EventRepositoryImpl implements EventRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private static final QEventEntity e = QEventEntity.eventEntity;

    @Override
    public Page<EventEntity> getList(Pageable pageable) {
        List<EventEntity> list = queryFactory
                .selectFrom(e)
                .where(e.delYn.eq("N"))
                .orderBy(e.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .select(e.count())
                .from(e)
                .where(e.delYn.eq("N"))
                .fetchOne();

        return new PageImpl<>(list, pageable, total == null ? 0 : total);
    }
}
