package com.kh.app.board.notice.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.board.notice.dto.request.NoticeCreateReqDto;
import com.kh.app.board.notice.dto.request.NoticeUpdateReqDto;
import com.kh.app.board.notice.dto.response.NoticeListRespDto;
import com.kh.app.board.notice.dto.response.NoticeRespDto;
import com.kh.app.board.notice.entity.NoticeEntity;
import com.kh.app.board.notice.entity.NoticeFileEntity;
import com.kh.app.board.notice.repository.NoticeFileRepository;
import com.kh.app.board.notice.repository.NoticeRepository;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class NoticeService {

    private final NoticeRepository noticeRepository;
    private final NoticeFileRepository noticeFileRepository;
    private final MemberRepository memberRepository;
    private final S3Service s3Service;

    // ── 일반 사용자용 ──────────────────────────────────────

    public Page<NoticeListRespDto> findAll(int page) {
        Pageable pageable = PageRequest.of(page, 10);
        return noticeRepository
                .findAllByDelYnOrderByCreatedAtDesc("N", pageable)
                .map(NoticeListRespDto::from);
    }

    public NoticeRespDto findById(Long id) {
        NoticeEntity notice = noticeRepository
                .findByIdAndDelYn(id, "N")
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));
        List<NoticeFileEntity> files =
                noticeFileRepository.findAllByNoticeIdAndDelYn(id, "N");
        return NoticeRespDto.from(notice, files);
    }

    // ── Admin용 ──────────────────────────────────────────

    public Page<NoticeListRespDto> findAllForAdmin(int page) {
        Pageable pageable = PageRequest.of(page, 10);
        return noticeRepository
                .findAllByOrderByCreatedAtDesc(pageable)
                .map(NoticeListRespDto::from);
    }

    public NoticeRespDto findByIdForAdmin(Long id) {
        NoticeEntity notice = noticeRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));
        List<NoticeFileEntity> files =
                noticeFileRepository.findAllByNoticeIdAndDelYn(id, "N");
        return NoticeRespDto.from(notice, files);
    }

    // ── 등록 ─────────────────────────────────────────────

    @Transactional
    public Long create(NoticeCreateReqDto dto, List<MultipartFile> files) {
        MemberEntity member = memberRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));

        NoticeEntity notice = dto.toEntity(member);
        noticeRepository.save(notice);

        uploadFiles(notice, files);

        return notice.getId();
    }

    // ── 수정 ─────────────────────────────────────────────

    @Transactional
    public void update(Long id, NoticeUpdateReqDto dto,
                       List<MultipartFile> newFiles, List<Long> deletedFileIds) {
        NoticeEntity notice = noticeRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));

        // 제목/내용/고정여부 수정
        notice.update(dto.getTitle(), dto.getContent(), dto.getPinYn());

        // 삭제 요청된 기존 파일 소프트 삭제
        if (deletedFileIds != null && !deletedFileIds.isEmpty()) {
            deletedFileIds.forEach(fileId ->
                    noticeFileRepository.findById(fileId)
                            .ifPresent(NoticeFileEntity::delete)
            );
        }

        // 새 파일 추가
        uploadFiles(notice, newFiles);
    }

    // ── 삭제 ─────────────────────────────────────────────

    @Transactional
    public void delete(Long id) {
        NoticeEntity notice = noticeRepository
                .findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지사항을 찾을 수 없습니다."));
        notice.delete();
    }

    // ── 공통 파일 업로드 유틸 ────────────────────────────

    private void uploadFiles(NoticeEntity notice, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) return;
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            try {
                String s3Key = s3Service.upload(file, "notice");
                NoticeFileEntity noticeFile = NoticeFileEntity.builder()
                        .notice(notice)
                        .originalFileName(file.getOriginalFilename())
                        .s3Key(s3Key)
                        .build();
                noticeFileRepository.save(noticeFile);
            } catch (IOException e) {
                log.error("파일 업로드 실패", e);
                throw new RuntimeException("파일 업로드에 실패했습니다.", e);
            }
        }
    }
}