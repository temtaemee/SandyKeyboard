package com.kh.app.product.space.controller;

import com.kh.app.product.space.dto.request.ArcadeInsertReqDto;
import com.kh.app.product.space.dto.response.ArcadeResDto;
import com.kh.app.product.space.service.SpaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Arcade - Seller", description = "편의시설 셀러 API")
@RestController
@RequestMapping("/api/seller/arcade")
@RequiredArgsConstructor
public class ArcadeSellerApiController {

    private final SpaceService spaceService;

    @Operation(summary = "편의시설 목록 전체 조회")
    @GetMapping
    public ResponseEntity<List<ArcadeResDto>> getAll() {
        return ResponseEntity.ok(spaceService.getAllArcades());
    }

    @Operation(summary = "편의시설 직접 추가", description = "셀러가 직접 편의시설 항목을 추가합니다.")
    @PostMapping
    public ResponseEntity<ArcadeResDto> create(@Valid @RequestBody ArcadeInsertReqDto dto) {
        return ResponseEntity.ok(spaceService.createArcade(dto));
    }
}
