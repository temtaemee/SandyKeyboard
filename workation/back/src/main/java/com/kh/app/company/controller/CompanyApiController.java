package com.kh.app.company.controller;

import com.kh.app.company.dto.req.CompanyCreateReqDto;
import com.kh.app.company.dto.resp.CompanyRespDto;
import com.kh.app.company.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Company", description = "기업 관리 API")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CompanyApiController {

    private final CompanyService companyService;

    @Operation(summary = "기업 목록 조회", description = "전체 기업 목록을 페이지 단위로 조회합니다. (비로그인 가능)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공")
    })
    @GetMapping("/public/company")
    public ResponseEntity<Page<CompanyRespDto>> listAll(//fdffd
            @Parameter(description = "페이지 번호 (0부터 시작)", example = "0")
            @RequestParam(defaultValue = "0") int pno) {
        Page<CompanyRespDto> dtoList = companyService.listAll(pno);
        return ResponseEntity.ok(dtoList);
    }

    @Operation(summary = "기업 등록", description = "새 기업을 등록합니다. (관리자 전용)")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "등록 성공"),
            @ApiResponse(responseCode = "403", description = "권한 없음")
    })
    @PostMapping("/admin/company")
    public ResponseEntity<Void> create(@RequestBody CompanyCreateReqDto dto) {
        companyService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "기업 정보 수정", description = "기업 ID로 기업 정보를 수정합니다. (관리자 전용)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "수정 성공"),
            @ApiResponse(responseCode = "404", description = "기업을 찾을 수 없음"),
            @ApiResponse(responseCode = "403", description = "권한 없음")
    })
    @PutMapping("/admin/company/{id}")
    public ResponseEntity<Object> update(
            @Parameter(description = "기업 ID", example = "1") @PathVariable Long id,
            @RequestBody CompanyCreateReqDto dto) {
        companyService.update(id, dto);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "기업 활성/비활성 토글", description = "기업 ID로 활성화 상태를 전환합니다. (관리자 전용)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "상태 변경 성공"),
            @ApiResponse(responseCode = "404", description = "기업을 찾을 수 없음"),
            @ApiResponse(responseCode = "403", description = "권한 없음")
    })
    @DeleteMapping("/admin/company/{id}")
    public ResponseEntity<Void> toggleActive(
            @Parameter(description = "기업 ID", example = "1") @PathVariable Long id) {
        companyService.toggleStatus(id);
        return ResponseEntity.ok().build();
    }
}
