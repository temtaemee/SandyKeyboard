package com.kh.app.member.service;

import com.kh.app.member.dto.request.SocialLoginReqDto;
import com.kh.app.member.dto.response.SocialLoginRespDto;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.SocialAccountEntity;
import com.kh.app.member.entity.MemberProfileEntity;
import com.kh.app.member.exception.SocialLinkRequiredException;
import com.kh.app.member.exception.SocialWithdrawnUserException;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.member.repository.ProfileRepository;
import com.kh.app.member.repository.SocialAccountRepository;
import com.kh.app.security.util.JwtUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GoogleAuthService {

    private final SocialAccountRepository socialAccountRepository;
    private final MemberRepository memberRepository;
    private final ProfileRepository memberProfileRepository; // 💡 프록시 방어용
    private final JwtUtil jwtUtil;

    // 💡 구글 클라우드 콘솔에서 발급받은 키를 넣어주세요.
    private final String clientId = "636736190970-kr8td75eis24br9sdgbqq8kentqno1td.apps.googleusercontent.com";
    private final String clientSecret = "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";
    private final String redirectUri = "http://localhost:5173/oauth/callback/google";

    @Transactional
    public SocialLoginRespDto googleLogin(SocialLoginReqDto dto) {
        // 1. 구글로부터 access_token 발급받기
        String googleAccessToken = getGoogleAccessToken(dto);

        // 2. access_token으로 구글 유저 정보(이메일, 고유 ID 등) 파싱
        JsonNode userInfo = getGoogleUserInfo(googleAccessToken);
        String socialId = userInfo.get("id").asText(); // 구글의 고유 유저 ID
        String email = userInfo.get("email").asText(); // 구글 이메일

        // 3. DB 회원 검증 및 신규 유저 판단 플래그 세팅 (네이버와 동일 구조)
        Optional<SocialAccountEntity> socialOpt =
                socialAccountRepository.findBySocialIdAndProvider(
                        socialId,
                        "GOOGLE"
                );
        MemberEntity memberEntity = null;
        boolean isNewUser = false;

        if (socialOpt.isPresent()) {

            memberEntity = socialOpt.get().getMember();

            if (memberEntity.getDeletedAt() != null) {
                throw new SocialWithdrawnUserException(
                        "탈퇴 처리된 계정입니다.",
                        email
                );
            }
            Optional<MemberProfileEntity> profileOpt =
                    memberProfileRepository.findById(memberEntity.getId());
            if (profileOpt.isEmpty()) {
                isNewUser = true;
            }
        }else {

            Optional<MemberEntity> memberOpt =
                    memberRepository.findMemberByUsername(email);

            if(memberOpt.isEmpty()) {

                memberEntity = new MemberEntity();
                memberEntity.setUsername(email);
                memberEntity.setPassword("");
                memberRepository.save(memberEntity);

                SocialAccountEntity newSocialEntity = new SocialAccountEntity();
                newSocialEntity.setSocialId(socialId);
                newSocialEntity.setMember(memberEntity);
                newSocialEntity.setProvider("GOOGLE");
                socialAccountRepository.save(newSocialEntity);

                isNewUser = true;

            } else {

                throw new SocialLinkRequiredException(
                        email,
                        socialId,
                        "GOOGLE"
                );
            }
        }




        // 4. 서비스 전용 자체 JWT 토큰 발행
        String appAccessToken = jwtUtil.createJwt(
                memberEntity.getId(),
                memberEntity.getUsername(),
                List.of("USER")
        );
        String area = null;
        if (memberEntity != null && memberEntity.getProfile() != null) {
            area = (memberEntity.getProfile().getPreferredArea() != null)
                    ? memberEntity.getProfile().getPreferredArea().name()
                    : null;
        }

        // 5. 공용 DTO 규격으로 리턴 (@JsonProperty("isNewUser")가 작동합니다)
        return SocialLoginRespDto.builder()
                .token(appAccessToken)
                .roles(memberEntity.getRoleSet().stream().toList())
                .isNewUser(isNewUser)
                .email(email)
                .preferredArea(area)
                .build();
    }

    // 🔵 구글 토큰 요청 RestTemplate 로직
    private String getGoogleAccessToken(SocialLoginReqDto dto) {
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("code", dto.getCode());

        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
        ResponseEntity<String> response = rt.exchange(
                "https://oauth2.googleapis.com/token", // 구글 토큰 교환 주소
                HttpMethod.POST,
                tokenRequest,
                String.class
        );

        try {
            return new ObjectMapper().readTree(response.getBody()).get("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("구글 토큰 파싱 실패", e);
        }
    }

    // 🔵 구글 유저 정보 요청 RestTemplate 로직
    private JsonNode getGoogleUserInfo(String accessToken) {
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        HttpEntity<Void> profileRequest = new HttpEntity<>(headers);
        ResponseEntity<String> response = rt.exchange(
                "https://www.googleapis.com/oauth2/v2/userinfo", // 구글 유저 정보 주소
                HttpMethod.GET,
                profileRequest,
                String.class
        );

        try {
            return new ObjectMapper().readTree(response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("구글 유저 정보 조회 실패", e);
        }
    }
}
