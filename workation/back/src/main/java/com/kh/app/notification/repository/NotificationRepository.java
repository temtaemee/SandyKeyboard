package com.kh.app.notification.repository;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.notification.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity,Long> {

    List<NotificationEntity> findByMemberIdOrderByCreatedAtDesc(Long memberId);

    List<NotificationEntity> findByMemberIdAndReadAtIsNull(Long memberId);

    int countByMemberIdAndReadAtIsNull(Long memberId);
}
