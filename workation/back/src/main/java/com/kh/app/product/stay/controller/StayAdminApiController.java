package com.kh.app.product.stay.controller;

import com.kh.app.product.exception.ErrorResponse;
import com.kh.app.product.space.entity.Area;
import com.kh.app.product.stay.dto.request.StayInsertReqDto;
import com.kh.app.product.stay.dto.request.StaySearchReqDto;
import com.kh.app.product.stay.dto.request.StayUpdateReqDto;
import com.kh.app.product.stay.dto.response.StayResDto;
import com.kh.app.product.stay.entity.StayOption;
import com.kh.app.product.stay.service.StayService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "Stay - Admin", description = "숙소 관리자 전용 API (소유권 검증 없음, 전체 데이터 접근)")
@RestController
@RequestMapping("/api/admin/stay")
@Slf4j
@RequiredArgsConstructor
public class StayAdminApiController {

    private final StayService stayService;

    @Operation(summary = "전체 숙소 목록 조회",
            description = "모든 숙소를 조회합니다. 다양한 동적 필터 지원 (visibleYn/delYn 포함).")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "ADMIN 권한 필요",
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
            @RequestParam(required = false) String visibleYn,
            @RequestParam(required = false) String delYn
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
        dto.setVisibleYn(visibleYn);
        dto.setDelYn(delYn);
        return ResponseEntity.ok(stayService.searchListForAdmin(dto));
    }

    @Operation(summary = "숙소 상세 조회 (삭제 포함)",
            description = "삭제된 숙소도 조회 가능합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "숙소 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<StayResDto> selectOne(@PathVariable Long id) {
        return ResponseEntity.ok(stayService.selectOneForAdmin(id));
    }

    @Operation(summary = "숙소 등록 (소유권 무관)",
            description = "소유권 검증 없이 모든 공간에 숙소를 등록할 수 있습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "등록 성공 - 생성된 숙소 ID 반환",
                    content = @Content(schema = @Schema(implementation = Long.class))),
            @ApiResponse(responseCode = "400", description = "입력값 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "공간 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> insert(
            @Valid @RequestPart("dto") StayInsertReqDto dto,
            @RequestPart(name = "files", required = false) List<MultipartFile> files
    ) {
        return ResponseEntity.ok(stayService.insertByAdmin(dto, files));
    }

    @Operation(summary = "숙소 수정 (소유권 무관)",
            description = "소유권 검증 없이 모든 숙소를 수정할 수 있습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "숙소 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @Valid @RequestBody StayUpdateReqDto dto
    ) {
        stayService.updateByAdmin(id, dto);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "숙소 삭제 (soft, 소유권 무관)",
            description = "소유권 검증 없이 모든 숙소를 삭제할 수 있습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "404", description = "숙소 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        stayService.deleteByAdmin(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "숙소 노출 여부 변경 (소유권 무관)",
            description = "소유권 검증 없이 모든 숙소의 visibleYn을 변경할 수 있습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "변경 성공"),
            @ApiResponse(responseCode = "404", description = "숙소 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}/visible")
    public ResponseEntity<Void> changeVisibleYn(
            @PathVariable Long id,
            @RequestParam String visibleYn
    ) {
        stayService.changeVisibleYnByAdmin(id, visibleYn);
        return ResponseEntity.ok().build();
    }
}
