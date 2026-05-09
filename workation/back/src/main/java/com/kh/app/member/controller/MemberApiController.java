package com.kh.app.member.controller;

import com.kh.app.member.dto.request.MemberJoinReqDto;
import com.kh.app.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class MemberApiController {
    private final MemberService memberService;
    @PostMapping("/guest/join")
    public void join(@RequestBody MemberJoinReqDto dto){
        memberService.join(dto);
        ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
