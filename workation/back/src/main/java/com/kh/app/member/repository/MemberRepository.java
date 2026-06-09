package com.kh.app.member.repository;

import com.kh.app.member.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, Long>,MemberRepositoryCustom {

    // 일반 조회용 (활성 회원만)
    Optional<MemberEntity> findByUsernameAndDeletedAtIsNull(String username);


    @Query("""
    select m
    from MemberEntity m
    left join fetch m.roleSet
    where m.username = :username
    and m.deletedAt is null
""")
    Optional<MemberEntity> findByUsername(String username);

    // 로그인용 (탈퇴회원 포함)
    Optional<MemberEntity> findMemberByUsername(String username);
}