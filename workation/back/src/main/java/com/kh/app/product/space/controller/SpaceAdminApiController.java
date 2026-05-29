package com.kh.app.product.space.controller;

import com.kh.app.product.exception.ErrorResponse;
import com.kh.app.product.space.dto.request.SpaceSearchReqDto;
import com.kh.app.product.space.dto.request.SpaceUpdateReqDto;
import com.kh.app.product.space.dto.response.SpaceResDto;
import com.kh.app.product.space.entity.Area;
import com.kh.app.product.space.service.SpaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Space - Admin", description = "공간 관리자 전용 API (소유권 검증 없음, 전체 데이터 접근)")
@RestController
@RequestMapping("/api/admin/space")
@Slf4j
@RequiredArgsConstructor
public class SpaceAdminApiController {

    private final SpaceService spaceService;

    @Operation(summary = "전체 공간 목록 조회",
            description = "모든 공간을 조회합니다. keyword/area/visibleYn/delYn 동적 필터 지원.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "ADMIN 권한 필요",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<SpaceResDto>> searchList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Area area,
            @RequestParam(required = false) String visibleYn,
            @RequestParam(required = false) String delYn
    ) {
        SpaceSearchReqDto dto = new SpaceSearchReqDto();
        dto.setKeyword(keyword);
        dto.setArea(area);
        dto.setVisibleYn(visibleYn);
        dto.setDelYn(delYn);
        return ResponseEntity.ok(spaceService.searchListForAdmin(dto));
    }

    @Operation(summary = "공간 상세 조회 (삭제 포함)",
            description = "삭제된 공간도 조회 가능합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "공간 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<SpaceResDto> selectOne(@PathVariable Long id) {
        return ResponseEntity.ok(spaceService.selectOneForAdmin(id));
    }

    @Operation(summary = "공간 수정 (소유권 무관)",
            description = "소유권 검증 없이 모든 공간을 수정할 수 있습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "공간 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @Valid @RequestBody SpaceUpdateReqDto reqDto
    ) {
        spaceService.updateByAdmin(id, reqDto);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "공간 삭제 (soft, 소유권 무관)",
            description = "소유권 검증 없이 모든 공간을 삭제할 수 있습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "404", description = "공간 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        spaceService.deleteByAdmin(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "공간 노출 여부 변경 (소유권 무관)",
            description = "소유권 검증 없이 모든 공간의 visibleYn을 변경할 수 있습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "변경 성공"),
            @ApiResponse(responseCode = "404", description = "공간 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}/visible")
    public ResponseEntity<Void> changeVisibleYn(
            @PathVariable Long id,
            @RequestParam String visibleYn
    ) {
        spaceService.changeVisibleYnByAdmin(id, visibleYn);
        return ResponseEntity.ok().build();
    }
}
