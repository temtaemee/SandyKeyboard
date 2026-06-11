package com.kh.app.middle.event.controller;

import com.kh.app.middle.event.dto.req.EventCreateReqDto;
import com.kh.app.middle.event.dto.resp.EventRespDto;
import com.kh.app.middle.event.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Event", description = "이벤트 관리 API")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class EventApiController {

    private final EventService eventService;

    @Operation(summary = "이벤트 등록 (관리자)")
    @PostMapping("/admin/events")
    public ResponseEntity<Void> create(@RequestBody EventCreateReqDto dto) {
        eventService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "이벤트 수정 (관리자)")
    @PutMapping("/admin/events/{eventId}")
    public ResponseEntity<Void> update(@PathVariable Long eventId, @RequestBody EventCreateReqDto dto) {
        eventService.update(eventId, dto);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "이벤트 삭제 (관리자)")
    @DeleteMapping("/admin/events/{eventId}")
    public ResponseEntity<Void> delete(@PathVariable Long eventId) {
        eventService.delete(eventId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @Operation(summary = "이벤트 목록 조회 (공개)")
    @GetMapping("/public/events")
    public ResponseEntity<Page<EventRespDto>> getList(@RequestParam(defaultValue = "0") int pno) {
        return ResponseEntity.ok(eventService.getList(pno));
    }

    @Operation(summary = "이벤트 목록 조회 (관리자 - 삭제 포함)")
    @GetMapping("/admin/events")
    public ResponseEntity<Page<EventRespDto>> getListAll(@RequestParam(defaultValue = "0") int pno) {
        return ResponseEntity.ok(eventService.getListAll(pno));
    }

    @Operation(summary = "이벤트 상세 조회 (공개)")
    @GetMapping("/public/events/{eventId}")
    public ResponseEntity<EventRespDto> getOne(@PathVariable Long eventId) {
        return ResponseEntity.ok(eventService.getOne(eventId));
    }
}
