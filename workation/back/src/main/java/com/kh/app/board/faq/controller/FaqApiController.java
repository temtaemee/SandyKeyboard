package com.kh.app.board.faq.controller;

import com.kh.app.board.faq.dto.request.FaqCreateReqDto;
import com.kh.app.board.faq.dto.request.FaqUpdateReqDto;
import com.kh.app.board.faq.dto.response.FaqRespDto;
import com.kh.app.board.faq.service.FaqService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class FaqApiController {

    private final FaqService faqService;

    // 목록 조회 (비로그인 가능)
    @GetMapping("/public/board/faq")
    public ResponseEntity<List<FaqRespDto>> findAll() {
        return ResponseEntity.ok(faqService.findAll());
    }

    // 등록 (로그인 필요)
    @PostMapping("/user/board/faq")
    public ResponseEntity<Long> create(@RequestBody FaqCreateReqDto dto) {
        Long id = faqService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

    // 수정 (로그인 필요)
    @PutMapping("/user/board/faq/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @RequestBody FaqUpdateReqDto dto
    ) {
        faqService.update(id, dto);
        return ResponseEntity.ok().build();
    }

    // 삭제 (로그인 필요)
    @DeleteMapping("/user/board/faq/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        faqService.delete(id);
        return ResponseEntity.ok().build();
    }
}