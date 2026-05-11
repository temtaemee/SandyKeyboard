package com.kh.app.member.repository;

import com.kh.app.member.entity.MemberProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfileRepository extends JpaRepository<MemberProfileEntity, Long> {
}
