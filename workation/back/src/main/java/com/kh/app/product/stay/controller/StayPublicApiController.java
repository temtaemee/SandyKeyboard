package com.kh.app.product.stay.controller;

import com.kh.app.product.exception.ErrorResponse;
import com.kh.app.product.space.entity.Area;
import com.kh.app.product.stay.dto.request.StaySearchReqDto;
import com.kh.app.product.stay.dto.response.StayResDto;
import com.kh.app.product.stay.entity.StayOption;
import com.kh.app.product.stay.service.StayService;
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

import java.util.List;

@Tag(name = "Stay - Public", description = "숙소 공개 조회 API (visibleYn=Y + delYn=N 강제)")
@RestController
@RequestMapping("/api/public/stay")
@Slf4j
@RequiredArgsConstructor
public class StayPublicApiController {

    private final StayService stayService;

    @Operation(summary = "공개 숙소 목록 조회",
            description = "visibleYn=Y, delYn=N 조건이 강제 적용됩니다. 다양한 동적 필터 지원.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<StayResDto>> searchList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long spaceId,
            @RequestParam(required = false) String workationYn,
            @RequestParam(required = false) Area area,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) List<StayOption> options
    ) {
        StaySearchReqDto dto = new StaySearchReqDto();
        dto.setKeyword(keyword);
        dto.setSpaceId(spaceId);
        dto.setWorkationYn(workationYn);
        dto.setArea(area);
        dto.setMinPrice(minPrice);
        dto.setMaxPrice(maxPrice);
        dto.setCapacity(capacity);
        dto.setOptions(options);
        return ResponseEntity.ok(stayService.searchListForPublic(dto));
    }

    @Operation(summary = "공개 숙소 상세 조회",
            description = "visibleYn=Y, delYn=N 조건이 강제 적용됩니다. 비공개/삭제된 숙소는 404 반환.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "숙소 없음 또는 비공개",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<StayResDto> selectOne(@PathVariable Long id) {
        return ResponseEntity.ok(stayService.selectOneForPublic(id));
    }
}
