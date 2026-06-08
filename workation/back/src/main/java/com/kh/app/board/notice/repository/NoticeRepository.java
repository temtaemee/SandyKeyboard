package com.kh.app.board.notice.repository;

import com.kh.app.board.notice.entity.NoticeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NoticeRepository extends JpaRepository<NoticeEntity, Long> {

    // 일반 사용자용 - 고정글 상단, 최신순
    Page<NoticeEntity> findAllByDelYnOrderByPinYnDescCreatedAtDesc(String delYn, Pageable pageable);
    Optional<NoticeEntity> findByIdAndDelYn(Long id, String delYn);

    // admin용 - 고정글 상단, 최신순 (delYn 조건 없이 전체)
    Page<NoticeEntity> findAllByOrderByPinYnDescCreatedAtDesc(Pageable pageable);
}