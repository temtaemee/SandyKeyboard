package com.kh.app.member.controller;

import com.kh.app.common.dto.PageRespDto;
import com.kh.app.member.dto.request.*;
import com.kh.app.member.dto.response.BankRespDto;
import com.kh.app.member.dto.response.MemberListRespDto;
import com.kh.app.member.dto.response.MemberMeRespDto;
import com.kh.app.member.dto.response.MemberRespDto;
import com.kh.app.member.repository.BankRepository;
import com.kh.app.member.service.MemberService;
import com.kh.app.security.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    @GetMapping("/auth/me")
    public MemberMeRespDto getMyInfo(Authentication authentication) {
        String username = authentication.getName();
        return memberService.getMyInfo(username);
    }

    @GetMapping("/admin/member/list")
    public ResponseEntity<PageRespDto<MemberListRespDto>> searchMembers(MemberSearchCondDto dto) {
        PageRespDto<MemberListRespDto> result = memberService.searchMembers(dto);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/admin/seller/list")
    public ResponseEntity<PageRespDto<MemberListRespDto>> searchSellers(SellerSearchCondDto dto){
        PageRespDto<MemberListRespDto> result = memberService.searchSellers(dto);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/admin/member/{memberId}")
    public ResponseEntity<MemberRespDto> getMemberDetail(@PathVariable Long memberId){
        MemberRespDto memberRespDto = memberService.getMemberDetail(memberId);
        return ResponseEntity.ok(memberRespDto);
    }

    @PatchMapping("/admin/member/{memberId}/ban")
    public ResponseEntity<Void> banMember(@PathVariable Long memberId){
        memberService.banMember(memberId);
        return ResponseEntity.ok().build();
    }
    @PatchMapping("/admin/member/{memberId}/unban")
    public ResponseEntity<Void> unbanMember(@PathVariable Long memberId){
        memberService.unbanMember(memberId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/user/member")
    public ResponseEntity<Object> editMyInfo(@AuthenticationPrincipal(expression = "memberId") Long memberId , @RequestBody MemberUpdateReqDto dto){
        memberService.editMyInfo(memberId,dto);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/user/member")
    public ResponseEntity<Object> updatePassword(@AuthenticationPrincipal(expression = "memberId") Long memberId,
                                                 @RequestBody MemberPasswordUpdateReqDto dto,
                                                 Authentication authentication
                                                 ){
        memberService.updatePassword(memberId,dto);
        System.out.println(authentication.getAuthorities());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/user/member")
    public ResponseEntity<Object> deleteAccount(@AuthenticationPrincipal(expression = "memberId") Long memberId){
        memberService.deleteAccount(memberId);
        return ResponseEntity.ok().build();
    }














}
