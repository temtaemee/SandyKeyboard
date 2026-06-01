package com.kh.app.product.space.controller;

import com.kh.app.product.exception.ErrorResponse;
import com.kh.app.product.space.dto.request.SpaceInsertReqDto;
import com.kh.app.product.space.dto.request.SpacePictureUpdateReqDto;
import com.kh.app.product.space.dto.request.SpaceUpdateReqDto;
import com.kh.app.product.space.dto.response.SpaceResDto;
import com.kh.app.product.space.service.SpaceService;
import com.kh.app.security.user.CustomUserDetails;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Tag(name = "Space - Seller", description = "공간 셀러 전용 API (본인 소유 공간만 접근 가능)")
@RestController
@RequestMapping("/api/seller/space")
@Slf4j
@RequiredArgsConstructor
public class SpaceSellerApiController {

    private final SpaceService spaceService;

    @Operation(summary = "공간 등록",
            description = "JWT 토큰에서 셀러 ID를 추출하여 공간을 등록합니다. sellerId는 DTO에 포함하지 않습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "등록 성공 - 생성된 공간 ID 반환",
                    content = @Content(schema = @Schema(implementation = Long.class))),
            @ApiResponse(responseCode = "400", description = "입력값 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "인증 필요",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "SELLER 권한 필요",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "500", description = "서버 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> insert(
            @Valid @RequestPart("dto") SpaceInsertReqDto reqDto,
            @RequestPart(name = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(spaceService.insert(reqDto, files, userDetails.getMemberId()));
    }

    @Operation(summary = "본인 공간 목록 조회",
            description = "JWT 토큰 기반으로 본인 소유 공간 전체를 조회합니다 (삭제/비노출 포함).")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "SELLER 권한 필요",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<SpaceResDto>> searchMySpaces(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(spaceService.searchListForSeller(userDetails.getMemberId()));
    }

    @Operation(summary = "본인 공간 상세 조회",
            description = "소유권을 검증합니다. 타인 공간 요청 시 403 반환.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "403", description = "소유권 없음 (SPACE_ACCESS_DENIED)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "공간 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<SpaceResDto> selectOne(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(spaceService.selectOneForSeller(id, userDetails.getMemberId()));
    }

    @Operation(summary = "본인 공간 수정",
            description = "소유권을 검증합니다. 타인 공간 수정 시 403 반환.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "소유권 없음 (SPACE_ACCESS_DENIED)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "공간 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @Valid @RequestBody SpaceUpdateReqDto reqDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        spaceService.update(id, reqDto, userDetails.getMemberId());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "본인 공간 삭제 (soft)",
            description = "소유권을 검증합니다. 타인 공간 삭제 시 403 반환.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "403", description = "소유권 없음 (SPACE_ACCESS_DENIED)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "공간 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        spaceService.delete(id, userDetails.getMemberId());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "본인 공간 노출 여부 변경",
            description = "소유권을 검증합니다. visibleYn = Y/N 으로 변경합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "변경 성공"),
            @ApiResponse(responseCode = "403", description = "소유권 없음 (SPACE_ACCESS_DENIED)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "공간 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}/visible")
    public ResponseEntity<Void> changeVisibleYn(
            @PathVariable Long id,
            @RequestParam String visibleYn,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        spaceService.changeVisibleYn(id, visibleYn, userDetails.getMemberId());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "승인 요청 (신규/재승인)",
            description = "공간 등록 후 또는 반려 이후 수정 완료 시 관리자에게 승인을 요청합니다. approvalStatus → PENDING.")
    @PostMapping("/{id}/request-approval")
    public ResponseEntity<Void> requestApproval(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        spaceService.requestApproval(id, userDetails.getMemberId());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "본인 공간 사진 수정",
            description = "keepPictureIds에 없는 기존 사진 삭제 + 새 사진 추가. files는 newPictures 배열과 인덱스 순서 일치 필수.")
    @PutMapping(value = "/{id}/pictures", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updatePictures(
            @PathVariable Long id,
            @RequestPart("dto") SpacePictureUpdateReqDto reqDto,
            @RequestPart(name = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        spaceService.updatePictures(id, reqDto, files, userDetails.getMemberId());
        return ResponseEntity.ok().build();
    }
}
