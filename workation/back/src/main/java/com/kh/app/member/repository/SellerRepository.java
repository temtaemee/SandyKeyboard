package com.kh.app.member.repository;

import com.kh.app.member.entity.SellerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SellerRepository extends JpaRepository<SellerEntity,Long> {
    @Query("select s from SellerEntity s " +
            "join fetch s.member m " +
            "join fetch s.bank b " +
            "left join fetch m.profile p " + // 방법 1의 양방향 구조일 때 유용
            "where s.memberId = :memberId")
    Optional<SellerEntity> findByIdWithMemberAndBank(@Param("memberId") Long memberId);
}
