package com.kh.app.product.space.controller;

import com.kh.app.product.exception.ErrorResponse;
import com.kh.app.product.space.dto.request.SpaceInsertReqDto;
import com.kh.app.product.space.dto.request.SpaceUpdateReqDto;
import com.kh.app.product.space.dto.response.SpaceResDto;
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "Space", description = "공간 관리 API")
@RestController
@RequestMapping("/api/public/space") // TODO: 인증 완성 후 /api/seller/space 로 복구
@Slf4j
@RequiredArgsConstructor
public class SpaceApiController {

    private final SpaceService spaceService;

    @Operation(summary = "공간 전체 조회", description = "삭제되지 않은 공간 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<SpaceResDto>> selectAll() {
        return ResponseEntity.ok(spaceService.selectAll());
    }

    @Operation(summary = "공간 상세 조회", description = "공간 ID로 단건 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "공간 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<SpaceResDto> selectOne(@PathVariable Long id) {
        return ResponseEntity.ok(spaceService.selectOne(id));
    }

    @Operation(summary = "공간 수정", description = "공간 정보를 수정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 오류 (유효성 검사 실패)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "공간 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @Valid @RequestBody SpaceUpdateReqDto reqDto
    ) {
        spaceService.update(id, reqDto);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "공간 삭제 (soft)", description = "공간을 소프트 삭제합니다 (delYn = Y).")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "404", description = "공간 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        spaceService.delete(id);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "공간 등록", description = "판매자가 새로운 공간을 등록합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "등록 성공 - 생성된 공간 ID 반환",
                    content = @Content(schema = @Schema(implementation = Long.class))),
            @ApiResponse(responseCode = "400", description = "입력값 오류 (유효성 검사 실패)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "접근 권한 없음 - 본인 소유 공간만 수정 가능",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "중복된 공간명 존재",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> insert(
            @Valid @RequestPart("dto") SpaceInsertReqDto reqDto,
            @RequestPart(name = "files", required = false) List<MultipartFile> files
    ) {
        return ResponseEntity.ok(spaceService.insert(reqDto, files));
    }
}
