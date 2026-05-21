package com.kh.app.middle.apply.controller;

import com.kh.app.middle.apply.dto.req.SpaceApplyPermitReqDto;
import com.kh.app.middle.apply.dto.req.SpaceApplyReqDto;
import com.kh.app.middle.apply.dto.resp.SpaceApplyRespDto;
import com.kh.app.middle.apply.service.SpaceApplyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Tag(name = "SpaceApply", description = "공간 심사 신청 API")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SpaceApplyAPiController {

    private final SpaceApplyService spaceApplyService;

    @Operation(summary = "심사 신청", description = "판매자가 공간 심사를 신청합니다.")
    @PostMapping("/seller/spaces/enroll")
    public ResponseEntity<Void> enroll(@RequestBody SpaceApplyReqDto dto) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        spaceApplyService.enroll(dto, name);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "심사 신청 목록 조회", description = "심사 신청 목록을 페이지 단위로 조회합니다.")
    @GetMapping("/seller/spaces/list")
    public ResponseEntity<Page<SpaceApplyRespDto>> getApplyList(@RequestParam(defaultValue = "0") int pno) {
        Page<SpaceApplyRespDto> list = spaceApplyService.getApplyList(pno);
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "심사 승인/거절 (관리자)", description = "관리자가 공간 심사를 승인하거나 거절합니다.")
    @PostMapping("/admin/spaces/{applyId}")
    public ResponseEntity<Object> permit(
            @PathVariable Long applyId,
            @RequestBody SpaceApplyPermitReqDto dto
    ) {
        spaceApplyService.update(applyId, dto);
        return ResponseEntity.status(HttpStatus.OK).build();
    }








}
