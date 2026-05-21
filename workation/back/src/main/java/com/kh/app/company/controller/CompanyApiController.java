package com.kh.app.company.controller;

import com.kh.app.company.dto.req.CompanyCreateReqDto;
import com.kh.app.company.service.CompanyService;
import lombok.RequiredArgsConstructor;
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
    public void listAll(){

    }

    //기업등록
    @PostMapping("/admin/company")
    public ResponseEntity<Void> create(@RequestBody CompanyCreateReqDto dto){
        companyService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    //기업수정
    @PutMapping ("/admin/company")
    public void update(){

    }

    //기업삭제
    @DeleteMapping("/admin/company")
    public void delete(){
    }
}
