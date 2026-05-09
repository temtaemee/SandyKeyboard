package com.kh.app.member.repository;

import com.kh.app.member.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, Long> {

    Optional<MemberEntity> findByUsernameAndDeletedAtIsNull(String username);

    @Query("""
    select m
    from MemberEntity m
    left join fetch m.roleList
    where m.username = :username
    and m.deletedAt is null
""")
    Optional<MemberEntity> findByUsername(String username);
}