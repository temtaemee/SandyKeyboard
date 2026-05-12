package com.kh.app.middle.apply.controller;

import com.kh.app.middle.apply.dto.req.SpaceApplyPermitReqDto;
import com.kh.app.middle.apply.service.SpaceApplyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
@RequestMapping("/api")
@RequiredArgsConstructor
public class SpaceApplyAPiController {

    private final SpaceApplyService spaceApplyService;

    // 심사 신청
    public void apply() {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
    }


    // 심사
    @PostMapping("/admin/spaces/{applyId}")
    public ResponseEntity<Object> permit(
            @PathVariable Long applyId,
            @RequestBody SpaceApplyPermitReqDto dto  // status만 담겨있음
    ) {
        // applyId로 SPACE_APPLY 조회 → spaceId는 서비스에서 꺼냄
//        spaceApplyService.create(applyId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
