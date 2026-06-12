package com.kh.app.member.service;

import com.kh.app.member.dto.request.SocialLoginReqDto;
import com.kh.app.member.dto.response.SocialLoginRespDto;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.Role;
import com.kh.app.member.entity.SocialAccountEntity;
import com.kh.app.member.entity.MemberProfileEntity;
import com.kh.app.member.exception.SocialWithdrawnUserException;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.member.repository.ProfileRepository;
import com.kh.app.member.repository.SocialAccountRepository;
import com.kh.app.security.util.JwtUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class KakaoAuthService {

    private final SocialAccountRepository socialAccountRepository;
    private final MemberRepository memberRepository;
    private final ProfileRepository memberProfileRepository; // 💡 프록시 방어용
    private final JwtUtil jwtUtil;

    @Value("${kakao.rest-api-key}")
    private String clientId;
    @Value("${kakao.redirect-uri}")
    private String redirectUri;
    @Value("${kakao.client-secret}")
    private String clientSecret;
    // 💡 방

    @Transactional
    public SocialLoginRespDto kakaoLogin(SocialLoginReqDto dto) {
        // 1. 카카오로부터 access_token 발급받기
        String kakaoAccessToken = getKakaoAccessToken(dto);

        // 2. access_token으로 카카오 유저 정보 파싱
        JsonNode userInfo = getKakaoUserInfo(kakaoAccessToken);
        String socialId = userInfo.path("id").asText();
        JsonNode kakaoAccount = userInfo.path("kakao_account");
        String email = kakaoAccount.path("email").asText(null);

        if (!StringUtils.hasText(socialId)) {
            throw new IllegalStateException("Kakao user id is missing from provider response.");
        }
        if (!StringUtils.hasText(email)) {
            throw new IllegalStateException("Kakao account email is missing. Check Kakao consent settings for account_email.");
        }

        // 🚨 [수정 포인트 1] 카카오 JSON에서 프로필 이미지 URL 안전하게 파싱하기
        String profileImageUrl = null;
        if (kakaoAccount.has("profile")) {
            JsonNode profileNode = kakaoAccount.get("profile");
            if (profileNode.has("profile_image_url")) {
                profileImageUrl = profileNode.get("profile_image_url").asText();
            }
        }

        // 3. DB 회원 검증 및 신규 유저 판단 플래그 세팅
        Optional<MemberEntity> memberOpt = memberRepository.findMemberByUsername(email);
        MemberEntity memberEntity;
        boolean isNewUser = false;

        if (memberOpt.isEmpty()) {
            // 신규 카카오 유저 가입 처리
            memberEntity = new MemberEntity();
            memberEntity.setUsername(email);
            memberEntity.setPassword("");
            memberEntity.getRoleSet().add(Role.USER);
            memberRepository.save(memberEntity);

            SocialAccountEntity newSocialEntity = new SocialAccountEntity();
            newSocialEntity.setSocialId(socialId);
            newSocialEntity.setMember(memberEntity);
            newSocialEntity.setProvider("KAKAO");
            socialAccountRepository.save(newSocialEntity);

            isNewUser = true;
        } else {
            memberEntity = memberOpt.get();

            if (memberEntity.getDeletedAt() != null) {
                // 🌟 꼼수 문자열 더하기 대신, 예외 객체에 이메일을 다이렉트로 주입!
                throw new SocialWithdrawnUserException("탈퇴 처리된 계정입니다.", email);
            }

            // 소셜 연동 데이터 누락 방어
            Optional<SocialAccountEntity> socialOpt = socialAccountRepository.findBySocialIdAndProvider(socialId, "KAKAO");
            if (socialOpt.isEmpty()) {
                SocialAccountEntity newSocialEntity = new SocialAccountEntity();
                newSocialEntity.setSocialId(socialId);
                newSocialEntity.setMember(memberEntity);
                newSocialEntity.setProvider("KAKAO");
                socialAccountRepository.save(newSocialEntity);
            }

            // 🚨 [수정 포인트 2] 기존 로그인 유저일 경우: 매번 로그인할 때마다 카카오 프로필 사진 최신화하기 🚀
            Optional<MemberProfileEntity> profileOpt = memberProfileRepository.findById(memberEntity.getId());
            if (profileOpt.isEmpty()) {
                isNewUser = true;
            } else {
                // 이미 가입된 회원은 프로필 엔티티에 카카오 사진을 실시간으로 동기화해 줍니다! (더티 체킹)
                MemberProfileEntity memberProfile = profileOpt.get();
                memberProfile.updateProfileImageUrl(profileImageUrl);
            }
        }

        // 4. 모래묻은 키보드 서비스 전용 JWT 토큰 발행
        memberEntity.getRoleSet().add(Role.USER);

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

        // 5. 공용 DTO 규격으로 리턴
        return SocialLoginRespDto.builder()
                .token(appAccessToken)
                .isNewUser(isNewUser)
                .roles(memberEntity.getRoleSet().stream().toList())
                .email(email)
                .preferredArea(area)
                .profileImageUrl(profileImageUrl) // 🚨 [수정 포인트 3] 신규 유저를 위해 리액트 가입 폼으로 사진을 토스! ✨
                .build();
    }

    // 🟨 카카오 토큰 교환 RestTemplate 로직
    private String getKakaoAccessToken(SocialLoginReqDto dto) {
        validateKakaoConfig();

        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        if (StringUtils.hasText(clientSecret)) {
            params.add("client_secret", clientSecret);
        }
        params.add("redirect_uri", redirectUri);
        params.add("code", dto.getCode());

        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
        ResponseEntity<String> response;
        try {
            response = rt.exchange(
                    "https://kauth.kakao.com/oauth/token", // 카카오 토큰 교환 주소
                    HttpMethod.POST,
                    tokenRequest,
                    String.class
            );
        } catch (RestClientResponseException e) {
            throw new IllegalStateException("Kakao token request failed: " + e.getStatusCode() + " " + e.getResponseBodyAsString(), e);
        }

        try {
            return new ObjectMapper().readTree(response.getBody()).get("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("카카오 토큰 파싱 실패", e);
        }
    }

    // 🟨 카카오 유저 프로필 요청 RestTemplate 로직
    private JsonNode getKakaoUserInfo(String accessToken) {
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<Void> profileRequest = new HttpEntity<>(headers);
        ResponseEntity<String> response;
        try {
            response = rt.exchange(
                    "https://kapi.kakao.com/v2/user/me", // 카카오 유저 정보 조회 주소
                    HttpMethod.GET,
                    profileRequest,
                    String.class
            );
        } catch (RestClientResponseException e) {
            throw new IllegalStateException("Kakao userinfo request failed: " + e.getStatusCode() + " " + e.getResponseBodyAsString(), e);
        }

        try {
            return new ObjectMapper().readTree(response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("카카오 유저 정보 조회 실패", e);
        }
    }

    private void validateKakaoConfig() {
        if (!StringUtils.hasText(clientId) || !StringUtils.hasText(redirectUri)) {
            throw new IllegalStateException("Kakao OAuth config is missing. Set KAKAO_REST_API_KEY and KAKAO_REDIRECT_URI.");
        }
    }
}
