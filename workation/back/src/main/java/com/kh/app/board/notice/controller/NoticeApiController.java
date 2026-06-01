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
    // 일반 사용자 공개 API (delYn = 'N' 조건 있음)
    // ─────────────────────────────────────────

    // 목록 조회
    // GET /api/public/notices?page=0
    @GetMapping("/public/notices")
    public ResponseEntity<Page<NoticeListRespDto>> findAll(
            @RequestParam(defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(noticeService.findAll(page));
    }

    // 상세 조회
    // GET /api/public/notices/{id}
    @GetMapping("/public/notices/{id}")
    public ResponseEntity<NoticeRespDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.findById(id));
    }

    // ─────────────────────────────────────────
    // Admin 전용 API
    // ─────────────────────────────────────────

    // 목록 조회 (삭제된 것 포함)
    // GET /api/admin/notices?page=0
    @GetMapping("/admin/notices")
    public ResponseEntity<Page<NoticeListRespDto>> findAllForAdmin(
            @RequestParam(defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(noticeService.findAllForAdmin(page));
    }

    // 상세 조회 (삭제된 것 포함)
    // GET /api/admin/notices/{id}
    @GetMapping("/admin/notices/{id}")
    public ResponseEntity<NoticeRespDto> findByIdForAdmin(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.findByIdForAdmin(id));
    }

    // 등록
    // POST /api/admin/notices
    @PostMapping(value = "/admin/notices", consumes = "multipart/form-data")
    public ResponseEntity<Long> create(
            @RequestPart("dto") NoticeCreateReqDto dto,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        log.info("공지사항 등록 요청 - title: {}, files: {}", dto.getTitle(), files != null ? files.size() : 0);
        Long id = noticeService.create(dto, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

    // 수정
    // PUT /api/admin/notices/{id}
    @PutMapping("/admin/notices/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @RequestBody NoticeUpdateReqDto dto
    ) {
        noticeService.update(id, dto);
        return ResponseEntity.ok().build();
    }

    // 삭제 (소프트 삭제)
    // DELETE /api/admin/notices/{id}
    @DeleteMapping("/admin/notices/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noticeService.delete(id);
        return ResponseEntity.ok().build();
    }
}