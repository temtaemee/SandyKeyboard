package com.kh.app.member.service;

import com.kh.app.member.dto.request.NaverLoginReqDto;
import com.kh.app.member.dto.response.SocialLoginRespDto;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.MemberProfileEntity;
import com.kh.app.member.entity.SocialAccountEntity;
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

public class NaverAuthService {

    private final SocialAccountRepository socialAccountRepository;
    private final MemberRepository memberRepository;
    private final ProfileRepository memberProfileRepository;
    private final JwtUtil jwtUtil;

    // 🔑 네이버 개발자 센터에서 발급받은 실제 키 값들을 넣어주세요!
    private final String clientId = "He0BQFaYRyk5Zk2p_Kdy";
    private final String clientSecret = "t4rgYNYw6b";

    @Transactional
    public SocialLoginRespDto naverLogin(NaverLoginReqDto dto) { // ✨ 리턴 타입 변경
        // 1. 네이버 토큰 교환 및 유저 정보 파싱
        String naverAccessToken = getNaverAccessToken(dto);
        JsonNode userInfo = getNaverUserInfo(naverAccessToken);

        JsonNode responseNode = userInfo.get("response");
        String socialId = responseNode.get("id").asText();
        String email = responseNode.has("email") ? responseNode.get("email").asText() : "NAVER_" + socialId;

        // 2. DB 검증 및 신규 유저 판단 플래그 세팅 🔍
        // NaverAuthService.java 의 회원 검증 로직 최종 교체 🛠️

// 1. 소셜 매핑 테이블이 아니라, 우리 서비스의 'MEMBER' 테이블 자체에 이 이메일(username)로 가입한 사람이 있는지 먼저 찾습니다.
        Optional<MemberEntity> memberOpt = memberRepository.findByUsername(email);
        MemberEntity memberEntity;
        boolean isNewUser = false;

        if (memberOpt.isEmpty()) {
            // [Case A] 진짜 우리 서비스에 단 한 번도 온 적 없는 생판 처음인 소셜 유저!
            memberEntity = new MemberEntity();
            memberEntity.setUsername(email);
            memberEntity.setPassword("");
            memberRepository.save(memberEntity);

            // 소셜 매핑 테이블도 새로 생성
            SocialAccountEntity newSocialEntity = new SocialAccountEntity();
            newSocialEntity.setSocialId(socialId);
            newSocialEntity.setMember(memberEntity);
            newSocialEntity.setProvider("NAVER");
            socialAccountRepository.save(newSocialEntity);

            isNewUser = true; // 🌟 당연히 프로필도 없으므로 신규 유저 확정!
        } else {
            // [Case B] 이메일(MEMBER 테이블)은 이미 존재함
            memberEntity = memberOpt.get();

            // 소셜 연동 데이터 누락 방어 코드
            Optional<SocialAccountEntity> socialOpt = socialAccountRepository.findBySocialIdAndProvider(socialId, "NAVER");
            if (socialOpt.isEmpty()) {
                SocialAccountEntity newSocialEntity = new SocialAccountEntity();
                newSocialEntity.setSocialId(socialId);
                newSocialEntity.setMember(memberEntity);
                newSocialEntity.setProvider("NAVER");
                socialAccountRepository.save(newSocialEntity);
            }

            // 🚨 [핵심 해결 지점] 프록시 껍데기(memberEntity.getProfile())에 속지 않고,
            // MemberProfileRepository를 주입받아 진짜 프로필 레코드가 DB에 존재하는지 직접 select 해봅니다!
            // (주의: 서비스 상단에 @RequiredArgsConstructor와 private final MemberProfileRepository memberProfileRepository; 를 선언해주세요!)
            Optional<MemberProfileEntity> profileOpt = memberProfileRepository.findById(memberEntity.getId());

            if (profileOpt.isEmpty()) {
                isNewUser = true; // 🌟 이메일 계정은 파여있지만, 진짜 프로필 정보가 없으므로 추가 정보 입력 대상으로 확정!
            }
        }


        // 3. 서비스 전용 자체 JWT 토큰 발행
        String appAccessToken = jwtUtil.createJwt(
                memberEntity.getId(),
                memberEntity.getUsername(),
                List.of("USER")
        );

        // 4. 확장 설계된 공용 DTO 빌더 반환 💯
        return SocialLoginRespDto.builder()
                .token(appAccessToken)
                .isNewUser(isNewUser)
                .email(email)
                .build();
    }

    private String getNaverAccessToken(NaverLoginReqDto dto) {
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("code", dto.getCode());
        params.add("state", dto.getState());

        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
        ResponseEntity<String> response = rt.exchange(
                "https://nid.naver.com/oauth2.0/token",
                HttpMethod.POST,
                tokenRequest,
                String.class
        );

        try {
            return new ObjectMapper().readTree(response.getBody()).get("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("네이버 토큰 파싱 실패", e);
        }
    }

    private JsonNode getNaverUserInfo(String accessToken) {
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        HttpEntity<Void> profileRequest = new HttpEntity<>(headers);
        ResponseEntity<String> response = rt.exchange(
                "https://openapi.naver.com/v1/nid/me",
                HttpMethod.GET,
                profileRequest,
                String.class
        );

        try {
            return new ObjectMapper().readTree(response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("네이버 유저 정보 조회 실패", e);
        }
    }
}