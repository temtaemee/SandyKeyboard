package com.kh.app.board.notice.repository;

import com.kh.app.board.notice.entity.NoticeFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeFileRepository extends JpaRepository<NoticeFileEntity, Long> {

    List<NoticeFileEntity> findAllByNoticeIdAndDelYn(Long noticeId, String delYn);
}
