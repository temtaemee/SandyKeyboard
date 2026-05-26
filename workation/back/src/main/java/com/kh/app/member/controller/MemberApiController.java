package com.kh.app.member.controller;

import com.kh.app.common.dto.PageRespDto;
import com.kh.app.member.dto.request.*;
import com.kh.app.member.dto.response.*;
import com.kh.app.member.repository.BankRepository;
import com.kh.app.member.service.GoogleAuthService;
import com.kh.app.member.service.KakaoAuthService;
import com.kh.app.member.service.MemberService;
import com.kh.app.member.service.NaverAuthService;
import com.kh.app.security.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class MemberApiController {
    private final MemberService memberService;
    private final BankRepository bankRepository;
    private final KakaoAuthService kakaoAuthService;
    private final NaverAuthService naverAuthService;
    private final GoogleAuthService googleAuthService;

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

    @PostMapping("/guest/find-username")
    public ResponseEntity<FindUsernameRespDto> findUsername(
            @RequestBody FindUsernameReqDto dto
    ) {
        FindUsernameRespDto result =
                memberService.findUsername(dto);

        return ResponseEntity.ok(result);
    }
    @PostMapping("/guest/send-email-code")
    public void sendEmailCode(@RequestBody FindPasswordReqDto dto ){
        memberService.sendEmailCode(dto);
    }
    @PostMapping("/guest/verify-email-code")
    public ResponseEntity<Object> verifyEmailCode(
            @RequestBody VerifyEmailCodeReqDto dto
    ) {
        memberService.verifyEmailCode(dto);
        return ResponseEntity.ok().build();
    }
    @PatchMapping("/guest/reset-password")
    public ResponseEntity<Object> resetPassword(
            @RequestBody ResetPasswordReqDto dto
    ) {
        memberService.resetPassword(dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/guest/kakao")
    public ResponseEntity<Map<String, String>> kakaoLogin(@RequestBody SocialLoginReqDto dto) {
        // 카카오 인증 및 서비스 JWT 발급 프로세스 진행
        String appAccessToken = kakaoAuthService.kakaoLogin(dto.getCode());

        // 리액트 규격({ token: '...' })에 맞게 반환 데이터 패키징
        Map<String, String> result = new HashMap<>();
        result.getOrDefault("token", appAccessToken); // 혹은 리액트 콜백의 response.data.token 구조에 맞춤

        return ResponseEntity.ok(result);
    }


    @PostMapping("/guest/naver")
    public ResponseEntity<SocialLoginRespDto> naverLogin(@RequestBody SocialLoginReqDto dto) {
        // 공용 소셜 응답 DTO 규격으로 리턴받음 ✨
        SocialLoginRespDto responseDto = naverAuthService.naverLogin(dto);
        System.out.println("responseDto = " + responseDto);
        return ResponseEntity.ok(responseDto);
    }
    // MemberApiController.java 에 추가

    @PostMapping("/guest/social-join")
    public ResponseEntity<String> socialJoin(@RequestBody SocialJoinReqDto dto) {
        // 💡 소셜 회원가입 마무리(프로필 생성) 로직 호출
        memberService.createSocialProfile(dto);
        return ResponseEntity.ok("소셜 연동 및 가입 완료!");
    }

    @PostMapping("/guest/google")
    public ResponseEntity<SocialLoginRespDto> googleLogin(@RequestBody SocialLoginReqDto dto) {
        // 공용 소셜 응답 규격으로 리턴 🔵
        SocialLoginRespDto responseDto = googleAuthService.googleLogin(dto);
        return ResponseEntity.ok(responseDto);
    }


















}
