package com.kh.app.product.space.controller;

import com.kh.app.product.exception.ErrorResponse;
import com.kh.app.product.space.dto.request.SpaceInsertReqDto;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Space", description = "공간 관리 API")
@RestController
@RequestMapping("/api/public/space") // TODO: 인증 완성 후 /api/seller/space 로 복구
@Slf4j
@RequiredArgsConstructor
public class SpaceApiController {

    private final SpaceService spaceService;

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
    @PostMapping
    public ResponseEntity<Long> insert(
            @Valid @RequestBody SpaceInsertReqDto reqDto
    ) {
        Long id = spaceService.insert(reqDto);
        return ResponseEntity.ok(id);
    }
}
