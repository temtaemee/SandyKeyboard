package com.kh.app.product.office.controller;

import com.kh.app.product.office.dto.request.OfficeInsertReqDto;
import com.kh.app.product.office.dto.request.OfficeUpdateReqDto;
import com.kh.app.product.office.dto.response.OfficeResDto;
import com.kh.app.product.office.service.OfficeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "Office", description = "오피스 관리 API")
@RestController
@Slf4j
@RequiredArgsConstructor
public class OfficeApiController {

    private final OfficeService officeService;

    @Operation(summary = "오피스 전체 조회")
    @GetMapping("/api/public/office")
    public ResponseEntity<List<OfficeResDto>> selectAll() {
        return ResponseEntity.ok(officeService.selectAll());
    }

    @Operation(summary = "오피스 상세 조회")
    @GetMapping("/api/public/office/{id}")
    public ResponseEntity<OfficeResDto> selectOne(@PathVariable Long id) {
        return ResponseEntity.ok(officeService.selectOne(id));
    }

    @Operation(summary = "오피스 등록", description = "multipart/form-data: dto(JSON) + files(이미지, 선택)")
    @PostMapping(value = "/api/seller/office", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> insert(
            @Valid @RequestPart("dto") OfficeInsertReqDto dto,
            @RequestPart(name = "files", required = false) List<MultipartFile> files
    ) {
        return ResponseEntity.ok(officeService.insert(dto, files));
    }

    @Operation(summary = "오피스 수정")
    @PutMapping("/api/seller/office/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @Valid @RequestBody OfficeUpdateReqDto dto
    ) {
        officeService.update(id, dto);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "오피스 노출 여부 변경")
    @PutMapping("/api/seller/office/{id}/visible")
    public ResponseEntity<Void> changeVisibleYn(
            @PathVariable Long id,
            @RequestParam String visibleYn
    ) {
        officeService.changeVisibleYn(id, visibleYn);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "오피스 삭제 (soft)")
    @DeleteMapping("/api/seller/office/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        officeService.delete(id);
        return ResponseEntity.ok().build();
    }
}
