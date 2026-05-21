package com.kh.app.company.controller;

import com.kh.app.company.dto.req.CompanyCreateReqDto;
import com.kh.app.company.dto.resp.CompanyRespDto;
import com.kh.app.company.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CompanyApiController {

    private final CompanyService companyService;


    // 기업 목록 조회 (페이지 번호 기본값 0)
    @GetMapping("/public/company")
    public ResponseEntity<Page<CompanyRespDto>> listAll(@RequestParam(defaultValue = "0") int pno){
        Page<CompanyRespDto> dtoList = companyService.listAll(pno);
        return ResponseEntity.ok(dtoList);
    }

    // 기업 등록 (관리자 전용)
    @PostMapping("/admin/company")
    public ResponseEntity<Void> create(@RequestBody CompanyCreateReqDto dto){
        companyService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // 기업 정보 수정 (관리자 전용)
    @PutMapping ("/admin/company/{id}")
    public ResponseEntity<Object> update(@PathVariable Long id, @RequestBody CompanyCreateReqDto dto){
        companyService.update(id, dto);
        return ResponseEntity.ok().build();
    }

    // 기업 활성/비활성 토글 (관리자 전용)
    @DeleteMapping("/admin/company/{id}")
    public ResponseEntity<Void> toggleActive(@PathVariable Long id){
        companyService.toggleStatus(id);
        return ResponseEntity.ok().build();
    }
}
