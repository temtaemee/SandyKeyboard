package com.kh.app.member.repository;

import com.kh.app.member.dto.request.MemberSearchCondDto;
import com.kh.app.member.dto.request.SellerSearchCondDto;
import com.kh.app.member.dto.response.MemberListRespDto;
import com.kh.app.member.entity.QMemberEntity;
import com.kh.app.member.entity.QMemberProfileEntity;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class MemberRepositoryImpl implements MemberRepositoryCustom {
    private static final QMemberEntity member = QMemberEntity.memberEntity;
    private final JPAQueryFactory queryFactory;
    private static final QMemberProfileEntity profile = QMemberProfileEntity.memberProfileEntity;

    @Override
    public List<MemberListRespDto> searchMembers(MemberSearchCondDto dto) {

        return queryFactory
                .select(
                        Projections.constructor(
                                MemberListRespDto.class,
                                member.id,
                                member.username,
                                profile.email,
                                profile.name,
                                member.banYn,
                                member.deletedAt,
                                member.seller.isNotNull(),
                                member.createdAt
                        )
                )
                .from(member)
                .leftJoin(member.profile, profile)
                .where(
                        keywordLike(dto.getKeyword()),
                        statusEq(dto.getStatus())
                )
                .orderBy(member.createdAt.desc())
                .offset(dto.getOffset())
                .limit(dto.getSize())
                .fetch();
    }

    @Override
    public long countMembers(MemberSearchCondDto dto) {
        Long count = queryFactory
                .select(member.count())
                .from(member)
                .leftJoin(member.profile, profile)
                .where(
                        keywordLike(dto.getKeyword()),
                        statusEq(dto.getStatus())
                )
                .fetchOne();
        return count == null ? 0 : count;
    }

    @Override
    public List<MemberListRespDto> searchSellers(SellerSearchCondDto dto) {
        return queryFactory
                .select(
                        Projections.constructor(
                                MemberListRespDto.class,
                                member.id,
                                member.username,
                                profile.email,
                                profile.name,
                                member.banYn,
                                member.deletedAt,
                                member.seller.isNotNull(),
                                member.createdAt
                        )
                )
                .from(member)
                .leftJoin(member.profile, profile)
                .where(
                        member.seller.isNotNull(),
                        keywordLike(dto.getKeyword()),
                        statusEq(dto.getStatus())
                )
                .orderBy(member.createdAt.desc())
                .offset(dto.getOffset())
                .limit(dto.getSize())
                .fetch();
    }

    @Override
    public long countSellers(SellerSearchCondDto dto) {
        Long count = queryFactory
                .select(member.count())
                .from(member)
                .leftJoin(member.profile, profile)
                .where(
                        member.seller.isNotNull(),
                        keywordLike(dto.getKeyword()),
                        statusEq(dto.getStatus())
                )
                .fetchOne();
        return count == null ? 0 : count;
    }

    private BooleanExpression keywordLike(String keyword) {

        if (keyword == null || keyword.isBlank()) {
            return null;
        }

        return member.username.contains(keyword)
                .or(profile.name.contains(keyword))
                .or(profile.email.contains(keyword));
    }

    private BooleanExpression statusEq(String status) {

        if(status == null || status.isBlank()) {
            return null;
        }
        if(status.equals("BANNED")) {
            return member.banYn.eq("Y");
        }
        if(status.equals("WITHDRAWN")) {
            return member.deletedAt.isNotNull();
        }
        if(status.equals("ACTIVE")) {
            return member.banYn.eq("N")
                    .and(member.deletedAt.isNull());
        }
        return null;
    }


}
