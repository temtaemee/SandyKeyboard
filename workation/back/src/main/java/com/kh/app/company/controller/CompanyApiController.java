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


    //기업목록조회
    @GetMapping("/public/company")
    public ResponseEntity<Page<CompanyRespDto>> listAll(@RequestParam(defaultValue = "0") int pno){
        Page<CompanyRespDto> dtoList = companyService.listAll(pno);
        return ResponseEntity.ok(dtoList);
    }

    //기업등록
    @PostMapping("/admin/company")
    public ResponseEntity<Void> create(@RequestBody CompanyCreateReqDto dto){
        companyService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    //기업수정
    @PutMapping ("/admin/company/{id}")
    public ResponseEntity<Object> update(@PathVariable Long id, @RequestBody CompanyCreateReqDto dto){
        companyService.update(id, dto);
        return ResponseEntity.ok().build();
    }

    //기업삭제 (활성/비활성)
    @DeleteMapping("/admin/company/{id}")
    public ResponseEntity<Void> toggleActive(@PathVariable Long id){
        companyService.toggleStatus(id);
        return ResponseEntity.ok().build();
    }
}
