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

    // 목록 조회 (페이징)
    // GET /api/public/board/notice?page=0
    @GetMapping("/public/board/notice")
    public ResponseEntity<Page<NoticeListRespDto>> findAll(
            @RequestParam(defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(noticeService.findAll(page));
    }

    // 상세 조회
    @GetMapping("/public/board/notice/{id}")
    public ResponseEntity<NoticeRespDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(noticeService.findById(id));
    }

    // 등록
    @PostMapping("/user/board/notice")
    public ResponseEntity<Long> create(
            @RequestPart("dto") NoticeCreateReqDto dto,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        Long id = noticeService.create(dto, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

    // 수정
    @PutMapping("/user/board/notice/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @RequestBody NoticeUpdateReqDto dto
    ) {
        noticeService.update(id, dto);
        return ResponseEntity.ok().build();
    }

    // 삭제
    @DeleteMapping("/user/board/notice/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        noticeService.delete(id);
        return ResponseEntity.ok().build();
    }
}