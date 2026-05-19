package com.kh.app.member.repository;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.MemberProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<MemberProfileEntity, Long> {
    Optional<MemberProfileEntity> findByNameAndEmail(String name, String email);
}
