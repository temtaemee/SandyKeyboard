package com.kh.app.member.repository;

import com.kh.app.member.entity.MemberProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProfileRepository extends JpaRepository<MemberProfileEntity, Long> {
    Optional<MemberProfileEntity> findByNameAndEmail(String name, String email);

    Optional<MemberProfileEntity> findByMemberUsernameAndEmail(String username, String email);

    Optional<MemberProfileEntity> findByEmail(String email);

    List<MemberProfileEntity> findByMemberIdIn(List<Long> memberIds);

    // 💡 추가: 특정 유저의 프로필 조회 (로그인한 유저의 preferredArea 조회용)
    Optional<MemberProfileEntity> findByMemberId(Long memberId);
}
