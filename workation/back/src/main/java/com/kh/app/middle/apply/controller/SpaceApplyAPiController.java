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
    @PostMapping("/seller/spaces/enroll/{spaceId}")
    public ResponseEntity<Void> enroll(@PathVariable Long spaceId) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        spaceApplyService.enroll(spaceId, name);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 리스트 불러오기
    @GetMapping("/seller/spaces/list")
    public void getApplyList(@RequestParam(defaultValue = "0") int pno) {
        spaceApplyService.getApplyList(pno);
    }

    // 심사
    @PostMapping("/admin/spaces/{applyId}")
    public ResponseEntity<Object> permit(
            @PathVariable Long applyId,
            @RequestBody SpaceApplyPermitReqDto dto  // status만 담겨있음
    ) {
//         applyId로 SPACE_APPLY 조회 → spaceId는 서비스에서 꺼냄
//        spaceApplyService.create(applyId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }






}
