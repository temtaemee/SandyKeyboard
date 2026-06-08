package com.kh.app.product.stay.controller;

import com.kh.app.product.exception.ErrorResponse;
import com.kh.app.product.stay.dto.request.StayInsertReqDto;
import com.kh.app.product.stay.dto.request.StayPictureUpdateReqDto;
import com.kh.app.product.stay.dto.request.StayUpdateReqDto;
import com.kh.app.product.stay.dto.response.StayResDto;
import com.kh.app.product.stay.service.StayService;
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

@Tag(name = "Stay - Seller", description = "숙소 셀러 전용 API (본인 소유 공간의 숙소만 접근 가능)")
@RestController
@RequestMapping("/api/seller/stay")
@Slf4j
@RequiredArgsConstructor
public class StaySellerApiController {

    private final StayService stayService;

    @Operation(summary = "숙소 등록",
            description = "JWT 토큰 기반 소유권 검증. 본인 소유 spaceId에만 숙소를 등록할 수 있습니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "등록 성공 - 생성된 숙소 ID 반환",
                    content = @Content(schema = @Schema(implementation = Long.class))),
            @ApiResponse(responseCode = "400", description = "입력값 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "인증 필요",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "SELLER 권한 필요 또는 소유권 없음 (SPACE_ACCESS_DENIED)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "공간 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> insert(
            @Valid @RequestPart("dto") StayInsertReqDto dto,
            @RequestPart(name = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(stayService.insert(dto, files, userDetails.getMemberId()));
    }

    @Operation(summary = "본인 숙소 목록 조회",
            description = "JWT 토큰 기반으로 본인 소유 공간의 전체 숙소를 조회합니다 (삭제/비노출 포함).")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "SELLER 권한 필요",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<List<StayResDto>> searchMyStays(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(stayService.searchMyStays(userDetails.getMemberId()));
    }

    @Operation(summary = "본인 숙소 상세 조회",
            description = "소유권을 검증합니다. 타인 숙소 요청 시 403 반환.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "403", description = "소유권 없음 (STAY_ACCESS_DENIED)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "숙소 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<StayResDto> selectOne(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(stayService.selectOneForSeller(id, userDetails.getMemberId()));
    }

    @Operation(summary = "본인 숙소 수정",
            description = "소유권을 검증합니다. 타인 숙소 수정 시 403 반환.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 오류",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "소유권 없음 (STAY_ACCESS_DENIED)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "숙소 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(
            @PathVariable Long id,
            @Valid @RequestBody StayUpdateReqDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        stayService.update(id, dto, userDetails.getMemberId());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "본인 숙소 노출 여부 변경",
            description = "소유권을 검증합니다. visibleYn = Y/N 으로 변경합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "변경 성공"),
            @ApiResponse(responseCode = "403", description = "소유권 없음 (STAY_ACCESS_DENIED)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "숙소 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}/visible")
    public ResponseEntity<Void> changeVisibleYn(
            @PathVariable Long id,
            @RequestParam String visibleYn,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        stayService.changeVisibleYn(id, visibleYn, userDetails.getMemberId());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "본인 숙소 사진 수정",
            description = "keepPictureIds 순서 = 새 sortOrder. mainPictureId로 대표 지정. files는 추가 업로드.")
    @PutMapping(value = "/{id}/pictures", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> updatePictures(
            @PathVariable Long id,
            @RequestPart("dto") StayPictureUpdateReqDto dto,
            @RequestPart(name = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        stayService.updatePictures(id, dto, files, userDetails.getMemberId());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "본인 숙소 삭제 (soft)",
            description = "소유권을 검증합니다. 타인 숙소 삭제 시 403 반환.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "삭제 성공"),
            @ApiResponse(responseCode = "403", description = "소유권 없음 (STAY_ACCESS_DENIED)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "숙소 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        stayService.delete(id, userDetails.getMemberId());
        return ResponseEntity.ok().build();
    }
}
