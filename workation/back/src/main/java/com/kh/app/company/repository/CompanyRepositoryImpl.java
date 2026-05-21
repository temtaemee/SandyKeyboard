package com.kh.app.company.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CompanyRepositoryImpl implements CompanyRepositoryCustom{

    private final JPAQueryFactory queryFactory;
}
