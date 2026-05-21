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

    // 기업 목록 페이징 조회 (최신 등록순)
    @Override
    public Page<CompanyEntity> getList(Pageable pageable) {
        List<CompanyEntity> content = queryFactory
                .selectFrom(c)
                .orderBy(c.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // 전체 건수 조회 (페이지 계산용)
        Long total = queryFactory
                .selectFrom(c)
                .fetchCount();

        return new PageImpl<>(content, pageable, total);
    }

}
