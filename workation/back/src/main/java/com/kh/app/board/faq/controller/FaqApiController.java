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

    // GET /api/public/faqs
    @GetMapping("/public/faqs")
    public ResponseEntity<List<FaqRespDto>> findAll() {
        return ResponseEntity.ok(faqService.findAll());
    }

    // GET /api/public/faqs/{id}
    @GetMapping("/public/faqs/{id}")
    public ResponseEntity<FaqRespDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(faqService.findById(id));
    }

    // POST /api/admin/faqs
    @PostMapping("/admin/faqs")
    public ResponseEntity<Long> create(@RequestBody FaqCreateReqDto dto) {
        Long id = faqService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(id);
    }

    // PUT /api/admin/faqs/{id}
    @PutMapping("/admin/faqs/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @RequestBody FaqUpdateReqDto dto
    ) {
        faqService.update(id, dto);
        return ResponseEntity.ok().build();
    }

    // DELETE /api/admin/faqs/{id}
    @DeleteMapping("/admin/faqs/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        faqService.delete(id);
        return ResponseEntity.ok().build();
    }
}