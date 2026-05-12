package com.kh.app.member.controller;

import com.kh.app.member.dto.request.MemberJoinReqDto;
import com.kh.app.member.dto.request.SellerApplyReqDto;
import com.kh.app.member.dto.response.BankRespDto;
import com.kh.app.member.entity.BankEntity;
import com.kh.app.member.repository.BankRepository;
import com.kh.app.member.service.MemberService;
import com.kh.app.security.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class MemberApiController {
    private final MemberService memberService;
    private final BankRepository bankRepository;
    @PostMapping("/guest/join")
    public ResponseEntity<Object> join(@RequestBody MemberJoinReqDto dto){
        memberService.join(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/user/seller")
    public ResponseEntity<Object> registerSeller(@RequestBody SellerApplyReqDto reqDto , @AuthenticationPrincipal CustomUserDetails userDetails ){
        Long memberId = userDetails.getUserVo().getId();
        memberService.registerSeller(reqDto,memberId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/user/banks")
    public ResponseEntity<List<BankRespDto>> getBankList() {
        List<BankRespDto> banks = bankRepository.findAll().stream()
                .map(BankRespDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(banks);
    }
















}
