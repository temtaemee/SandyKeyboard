package com.kh.app.product.space.controller;

import com.kh.app.product.space.dto.response.ArcadeResDto;
import com.kh.app.product.space.service.SpaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Arcade - Public", description = "편의시설 공개 조회 API")
@RestController
@RequestMapping("/api/public/arcade")
@RequiredArgsConstructor
public class ArcadePublicApiController {

    private final SpaceService spaceService;

    @Operation(summary = "편의시설 전체 목록 조회 (비로그인 접근 가능)")
    @GetMapping
    public ResponseEntity<List<ArcadeResDto>> getAll() {
        return ResponseEntity.ok(spaceService.getAllArcades());
    }
}
