package com.kh.app.middle.apply.controller;

import com.kh.app.middle.apply.dto.req.SpaceApplyPermitReqDto;
import com.kh.app.middle.apply.dto.req.SpaceApplyReqDto;
import com.kh.app.middle.apply.dto.resp.SpaceApplyRespDto;
import com.kh.app.middle.apply.service.SpaceApplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SpaceApplyAPiController {

    private final SpaceApplyService spaceApplyService;

    // 심사 신청
    @PostMapping("/seller/spaces/enroll")
    public ResponseEntity<Void> enroll(@RequestBody SpaceApplyReqDto dto) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        spaceApplyService.enroll(dto, name);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 리스트 불러오기
    @GetMapping("/seller/spaces/list")
    public ResponseEntity<Page<SpaceApplyRespDto>> getApplyList(@RequestParam(defaultValue = "0") int pno) {
        Page<SpaceApplyRespDto> list = spaceApplyService.getApplyList(pno);
        return ResponseEntity.ok(list);
    }

    // 심사
    @PostMapping("/admin/spaces/{applyId}")
    public ResponseEntity<Object> permit(
            @PathVariable Long applyId,
            @RequestBody SpaceApplyPermitReqDto dto  // status만 담겨있음
    ) {
//         applyId로 SPACE_APPLY 조회 → spaceId는 서비스에서 꺼냄
        spaceApplyService.update(applyId, dto);
        return ResponseEntity.status(HttpStatus.OK).build();
    }








}
