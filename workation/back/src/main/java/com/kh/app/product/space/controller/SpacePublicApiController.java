package com.kh.app.product.space.controller;

import com.kh.app.product.exception.ErrorResponse;
import com.kh.app.product.space.dto.request.SpaceSearchReqDto;
import com.kh.app.product.space.dto.response.SpaceResDto;
import com.kh.app.product.space.entity.Area;
import com.kh.app.product.space.service.SpaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@Tag(name = "Space - Public", description = "공간 공개 조회 API (visibleYn=Y + delYn=N 강제)")
@RestController
@RequestMapping("/api/public/space")
@Slf4j
@RequiredArgsConstructor
public class SpacePublicApiController {

    private final SpaceService spaceService;

    @Operation(summary = "공개 공간 목록 조회",
            description = "visibleYn=Y, delYn=N 조건이 강제 적용됩니다. keyword/area 동적 필터 지원.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<SpaceResDto>> searchList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Area area,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) List<Long> arcadeIds
    ) {
        SpaceSearchReqDto dto = new SpaceSearchReqDto();
        dto.setKeyword(keyword);
        dto.setArea(area);
        dto.setStartDate(startDate);
        dto.setEndDate(endDate);
        dto.setCapacity(capacity);
        dto.setArcadeIds(arcadeIds);
        return ResponseEntity.ok(spaceService.searchListForPublic(dto));
    }

    @Operation(summary = "공개 공간 상세 조회",
            description = "visibleYn=Y, delYn=N 조건이 강제 적용됩니다. 비공개 공간은 404 반환.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "공간 없음 또는 비공개",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<SpaceResDto> selectOne(@PathVariable Long id) {
        return ResponseEntity.ok(spaceService.selectOneForPublic(id));
    }

    @GetMapping("/list/recommended")
    public ResponseEntity<List<SpaceResDto>> getRecommendedSpaces(@RequestParam(required = false) Area area) {
        return ResponseEntity.ok(spaceService.getRecommendedSpaces(area));
    }
}
