package com.kh.app.product.stay.controller;

import com.kh.app.product.exception.ErrorResponse;
import com.kh.app.product.space.entity.Area;
import com.kh.app.product.stay.dto.request.StaySearchReqDto;
import com.kh.app.product.stay.dto.response.BookedPeriodResDto;
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
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
            @RequestParam(required = false) List<StayOption> options,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
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
        dto.setStartDate(startDate);
        dto.setEndDate(endDate);
        return ResponseEntity.ok(stayService.searchListForPublic(dto));
    }

    @Operation(summary = "공개 숙소 상세 조회",
            description = "visibleYn=Y, delYn=N 조건이 강제 적용됩니다. startDate/endDate 제공 시 availableYn 포함.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "숙소 없음 또는 비공개",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<StayResDto> selectOne(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(stayService.selectOneForPublic(id, startDate, endDate));
    }

    @Operation(summary = "숙소 예약 구간 조회",
            description = "달력 블록 표시용. 취소되지 않은 예약의 체크인~체크아웃 구간 목록을 반환합니다.")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/{id}/booked-dates")
    public ResponseEntity<List<BookedPeriodResDto>> getBookedDates(@PathVariable Long id) {
        return ResponseEntity.ok(stayService.getBookedPeriods(id));
    }
}
