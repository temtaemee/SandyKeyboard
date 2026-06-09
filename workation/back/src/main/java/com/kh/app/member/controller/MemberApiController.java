package com.kh.app.member.controller;

import com.kh.app.common.dto.PageRespDto;
import com.kh.app.member.dto.request.*;
import com.kh.app.member.dto.response.*;
import com.kh.app.member.exception.SocialLinkRequiredException;
import com.kh.app.member.exception.SocialWithdrawnUserException;
import com.kh.app.member.repository.BankRepository;
import com.kh.app.member.service.*;
import com.kh.app.security.user.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

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
    private final SocialLinkService socialLinkService;

    @PostMapping("/guest/join")
    public ResponseEntity<Object> join(@RequestBody MemberJoinReqDto dto){
        memberService.join(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/user/seller")
    public ResponseEntity<Object> registerSeller(@RequestBody SellerApplyReqDto reqDto , @AuthenticationPrincipal CustomUserDetails userDetails ){
        log.info("들어온 판매자 등록 요청 데이터: {}", reqDto);
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

    // 🌟 카카오 로그인
    @PostMapping("/guest/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody SocialLoginReqDto dto) {
        try {
            SocialLoginRespDto respDto = kakaoAuthService.kakaoLogin(dto);
            return ResponseEntity.ok(respDto);
        } catch (SocialWithdrawnUserException e) { // 🌟 우리가 만든 커스텀 예외 캐치!
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(SocialLoginErrorRespDto.builder()
                            .result("fail")
                            .message(e.getMessage())
                            .email(e.getEmail()) // 🌟 예외 객체에서 이메일 깔끔하게 추출!
                            .build());
        }catch (SocialLinkRequiredException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            SocialLoginErrorRespDto.builder()
                                    .result("LINK_REQUIRED")
                                    .message(e.getMessage())
                                    .email(e.getEmail())
                                    .socialId(e.getSocialId())
                                    .provider(e.getProvider())
                                    .build()
                    );
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🌟 네이버 로그인
    @PostMapping("/guest/naver")
    public ResponseEntity<?> naverLogin(@RequestBody SocialLoginReqDto dto) {
        try {
            SocialLoginRespDto responseDto = naverAuthService.naverLogin(dto);
            return ResponseEntity.ok(responseDto);
        } catch (SocialWithdrawnUserException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(SocialLoginErrorRespDto.builder()
                            .result("fail")
                            .message(e.getMessage())
                            .email(e.getEmail())
                            .build());
        } catch (SocialLinkRequiredException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            SocialLoginErrorRespDto.builder()
                                    .result("LINK_REQUIRED")
                                    .message(e.getMessage())
                                    .email(e.getEmail())
                                    .socialId(e.getSocialId())
                                    .provider(e.getProvider())
                                    .build()
                    );
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 🌟 구글 로그인
    @PostMapping("/guest/google")
    public ResponseEntity<?> googleLogin(@RequestBody SocialLoginReqDto dto) {
        try {
            SocialLoginRespDto responseDto = googleAuthService.googleLogin(dto);
            return ResponseEntity.ok(responseDto);
        } catch (SocialWithdrawnUserException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(SocialLoginErrorRespDto.builder()
                            .result("fail")
                            .message(e.getMessage())
                            .email(e.getEmail())
                            .build());
        } catch (SocialLinkRequiredException e) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            SocialLoginErrorRespDto.builder()
                                    .result("LINK_REQUIRED")
                                    .message(e.getMessage())
                                    .email(e.getEmail())
                                    .socialId(e.getSocialId())
                                    .provider(e.getProvider())
                                    .build()
                    );
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/guest/social-join")
    public ResponseEntity<String> socialJoin(@RequestBody SocialJoinReqDto dto) {
        // 💡 소셜 회원가입 마무리(프로필 생성) 로직 호출
        memberService.createSocialProfile(dto);
        return ResponseEntity.ok("소셜 연동 및 가입 완료!");
    }
    @GetMapping("/seller/me")
    public ResponseEntity<SellerRespDto> getSellerInfo(@AuthenticationPrincipal(expression = "memberId") Long memberId){
        return ResponseEntity.ok(memberService.getSellerInfo(memberId));
    }

    @PutMapping("/seller/me")
    public ResponseEntity<Void> updateSellerInfo(
            @AuthenticationPrincipal(expression = "memberId") Long memberId,
            @RequestBody SellerUpdateReqDto dto
    ) {
        memberService.updateSellerInfo(memberId, dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/guest/restore")
    public ResponseEntity<String> restoreAccount(@RequestBody Map<String, String> requestMap){
        String username = requestMap.get("username");
        memberService.restoreAccount(username);
        return ResponseEntity.ok().body("{\"result\": \"success\"}");
    }


    @PostMapping("/public/social/send-code")
    public void sendSocialLinkCode(@RequestBody EmailVerifyReqDto dto){
        memberService.sendSocialLinkEmailCode(dto);
    }

    @PostMapping("/public/social/link")
    public void socialLink(@RequestBody SocialLinkReqDto dto){
        socialLinkService.socialLink(dto);
    }
    @PostMapping("/public/social/verify-code")
    public void verifySocialLinkCode(
            @RequestBody VerifyEmailCodeReqDto dto
    ){
        memberService.verifyEmailCode(dto);
    }




















}
