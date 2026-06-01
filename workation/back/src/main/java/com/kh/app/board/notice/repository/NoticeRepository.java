package com.kh.app.board.notice.repository;

import com.kh.app.board.notice.entity.NoticeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NoticeRepository extends JpaRepository<NoticeEntity, Long> {

    // 일반 사용자용 - delYn = 'N' 조건 있음
    Page<NoticeEntity> findAllByDelYnOrderByCreatedAtDesc(String delYn, Pageable pageable);
    Optional<NoticeEntity> findByIdAndDelYn(Long id, String delYn);

    // admin용 - delYn 조건 없이 전체 조회
    Page<NoticeEntity> findAllByOrderByCreatedAtDesc(Pageable pageable);
}