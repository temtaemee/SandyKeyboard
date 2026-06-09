package com.kh.app.member.repository;

import com.kh.app.member.entity.SocialAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SocialAccountRepository extends JpaRepository<SocialAccountEntity, String> {
    // 이미 가입된 소셜 계정인지 찾기 위한 메서드
    Optional<SocialAccountEntity> findBySocialIdAndProvider(String socialId, String provider);
}