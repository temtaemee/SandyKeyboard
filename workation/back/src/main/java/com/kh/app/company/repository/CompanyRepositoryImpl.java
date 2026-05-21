package com.kh.app.company.repository;

import com.kh.app.company.entity.CompanyEntity;
import com.kh.app.company.entity.QCompanyEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RequiredArgsConstructor
public class CompanyRepositoryImpl implements CompanyRepositoryCustom{

    private final JPAQueryFactory queryFactory;
    private final static QCompanyEntity c = QCompanyEntity.companyEntity;

    @Override
    public Page<CompanyEntity> getList(Pageable pageable) {
        List<CompanyEntity> content = queryFactory
                .selectFrom(c)
                .orderBy(c.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = queryFactory
                .selectFrom(c)
                .fetchCount();

        return new PageImpl<>(content, pageable, total);
    }

}
