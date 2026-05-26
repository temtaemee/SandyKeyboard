package com.kh.app.member.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.SocialAccountEntity;
import com.kh.app.member.repository.MemberRepository;
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
import java.util.List;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class KakaoAuthService {

    private final SocialAccountRepository socialAccountRepository;
    private final MemberRepository memberRepository;
    private final JwtUtil jwtUtil;

    @Transactional
    public String kakaoLogin(String code) {
        // 1. 리액트가 준 인가 코드로 카카오 액세스 토큰 받기
        String kakaoAccessToken = getAccessToken(code);

        // 2. 카카오 액세스 토큰으로 사용자 정보 가져오기
        JsonNode userInfo = getUserInfo(kakaoAccessToken);
        String socialId = userInfo.get("id").asText();

        // 이메일 정보가 없는 경우를 대비한 방어 코드
        String email = userInfo.has("kakao_account") && userInfo.get("kakao_account").has("email")
                ? userInfo.get("kakao_account").get("email").asText()
                : "KAKAO_" + socialId;

        // 3. 가입 여부 확인 (소셜 매핑 엔티티 규칙 반영 ✨)
        Optional<SocialAccountEntity> socialAccountOpt = socialAccountRepository.findBySocialIdAndProvider(socialId, "KAKAO");
        MemberEntity memberEntity;

        if (socialAccountOpt.isPresent()) {
            // 이미 등록된 소셜 회원이면 매핑된 MemberEntity 추출
            memberEntity = socialAccountOpt.get().getMember();
        } else {
            // 미가입 자면 새로 회원가입 처리 (MemberEntity 규칙 반영 ✨)
            memberEntity = new MemberEntity();
            memberEntity.setUsername(email);
            memberEntity.setPassword(""); // 소셜은 비밀번호가 없으므로 공백 처리
            memberRepository.save(memberEntity);

            // 매핑 테이블 엔티티 생성 및 저장 (SocialAccountEntity 규칙 반영 ✨)
            SocialAccountEntity newSocialEntity = new SocialAccountEntity();
            newSocialEntity.setSocialId(socialId);
            newSocialEntity.setMember(memberEntity); // 연관관계 매핑 메서드 이름 주의
            newSocialEntity.setProvider("KAKAO");
            socialAccountRepository.save(newSocialEntity);
        }

        // 4. 우리 서비스 전용 JWT 토큰 발행하여 리턴
        // 4. 기존 시스템의 규격대로 서비스 전용 JWT 토큰 발행하여 리턴 (수정 완료 ✨)
        return jwtUtil.createJwt(
                memberEntity.getId(),        // 1) Long memberId (기존 MemberEntity의 PK 가칭)
                memberEntity.getUsername(),  // 2) String username (이메일 혹은 카카오 고유값)
                List.of("USER")              // 3) List<String> roles (소셜 가입자의 기본 권한 설정)
        );
    }

    // ── 카카오 서버로 토큰 교환 요청 ──
    private String getAccessToken(String code) {
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", "7dbf7972ddee89b3240ad17fbdb6e41d"); // REST API 키
        params.add("redirect_uri", "http://localhost:5173/oauth/callback/kakao");
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
        ResponseEntity<String> response = rt.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                tokenRequest,
                String.class
        );

        try {
            return new ObjectMapper().readTree(response.getBody()).get("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("카카오 토큰 파싱 실패", e);
        }
    }

    // ── 카카오 서버로 유저 정보 요청 ──
    private JsonNode getUserInfo(String accessToken) {
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> profileRequest = new HttpEntity<>(headers);
        ResponseEntity<String> response = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                profileRequest,
                String.class
        );

        try {
            return new ObjectMapper().readTree(response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("카카오 유저 정보 조회 실패", e);
        }
    }
}