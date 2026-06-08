package com.kh.app.board.notice.controller;

import com.kh.app.board.notice.dto.request.NoticeCreateReqDto;
import com.kh.app.board.notice.dto.request.NoticeUpdateReqDto;
import com.kh.app.board.notice.dto.response.NoticeListRespDto;
import com.kh.app.board.notice.dto.response.NoticeRespDto;
import com.kh.app.board.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class NoticeApiController {

    private final NoticeService noticeService;

    // ─────────────────────────────────────────
    // 일반 사용자 공개 API
    // ─────────────────────────────────────────

    @GetMapping("/public/notices")
    public ResponseEntity<Page<NoticeListRespDto>> findAll(
            @RequestParam(defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(noticeService.findAll(page));
    }

    @GetMapping("/public/notices/{id}")
    public ResponseEntity<NoticeRespDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.findById(id));
    }

    // ─────────────────────────────────────────
    // Admin 전용 API
    // ─────────────────────────────────────────

    @GetMapping("/admin/notices")
    public ResponseEntity<Page<NoticeListRespDto>> findAllForAdmin(
            @RequestParam(defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(noticeService.findAllForAdmin(page));
    }

    @GetMapping("/admin/notices/{id}")
    public ResponseEntity<NoticeRespDto> findByIdForAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.findByIdForAdmin(id));
    }

    // 등록
    @PostMapping(value = "/admin/notices", consumes = "multipart/form-data")
    public ResponseEntity<Long> create(
            @RequestPart("dto") NoticeCreateReqDto dto,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        log.info("공지사항 등록 요청 - title: {}, files: {}", dto.getTitle(), files != null ? files.size() : 0);
        Long id = noticeService.create(dto, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

    // 수정 — multipart로 변경 (파일 추가 + deletedFileIds 전송)
    @PutMapping(value = "/admin/notices/{id}", consumes = "multipart/form-data")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @RequestPart("dto") NoticeUpdateReqDto dto,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "deletedFileIds", required = false) List<Long> deletedFileIds
    ) {
        noticeService.update(id, dto, files, deletedFileIds);
        return ResponseEntity.ok().build();
    }

    // 삭제
    @DeleteMapping("/admin/notices/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noticeService.delete(id);
        return ResponseEntity.ok().build();
    }
}