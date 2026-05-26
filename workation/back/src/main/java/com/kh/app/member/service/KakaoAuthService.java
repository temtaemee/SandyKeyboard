package com.kh.app.member.service;

import com.kh.app.member.dto.request.SocialLoginReqDto;
import com.kh.app.member.dto.response.SocialLoginRespDto;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.SocialAccountEntity;
import com.kh.app.member.entity.MemberProfileEntity;
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
public class KakaoAuthService {

    private final SocialAccountRepository socialAccountRepository;
    private final MemberRepository memberRepository;
    private final ProfileRepository memberProfileRepository; // 💡 프록시 방어용
    private final JwtUtil jwtUtil;

    // 💡 방금 새로 만드신 앱의 REST API 키와 발급받은 Client Secret을 넣어주세요!
    private final String clientId = "d9a689a25f662f9366b1e782bce9d86e";
    private final String clientSecret = "RWf4bxjIpvFQoz3ZgpVL0f366GqPQyrP";
    private final String redirectUri = "http://localhost:5173/oauth/callback/kakao";

    @Transactional
    public SocialLoginRespDto kakaoLogin(SocialLoginReqDto dto) {
        // 1. 카카오로부터 access_token 발급받기
        String kakaoAccessToken = getKakaoAccessToken(dto);

        // 2. access_token으로 카카오 유저 정보(이메일, 고유 ID) 파싱
        JsonNode userInfo = getKakaoUserInfo(kakaoAccessToken);
        String socialId = userInfo.get("id").asText(); // 카카오의 고유 유저 Long ID값 (텍스트 변환)

        // 카카오 JSON 구조는 kakao_account 내부에 이메일이 숨어있습니다. 🚨 중요
        String email = userInfo.get("kakao_account").get("email").asText();

        // 3. DB 회원 검증 및 신규 유저 판단 플래그 세팅 (대통합 아키텍처 적용)
        Optional<MemberEntity> memberOpt = memberRepository.findByUsername(email);
        MemberEntity memberEntity;
        boolean isNewUser = false;

        if (memberOpt.isEmpty()) {
            // 신규 카카오 유저 가입 처리
            memberEntity = new MemberEntity();
            memberEntity.setUsername(email);
            memberEntity.setPassword("");
            memberRepository.save(memberEntity);

            SocialAccountEntity newSocialEntity = new SocialAccountEntity();
            newSocialEntity.setSocialId(socialId);
            newSocialEntity.setMember(memberEntity);
            newSocialEntity.setProvider("KAKAO"); // 🟨 프로바이더 카카오 지정
            socialAccountRepository.save(newSocialEntity);

            isNewUser = true;
        } else {
            memberEntity = memberOpt.get();

            // 소셜 연동 데이터 누락 방어
            Optional<SocialAccountEntity> socialOpt = socialAccountRepository.findBySocialIdAndProvider(socialId, "KAKAO");
            if (socialOpt.isEmpty()) {
                SocialAccountEntity newSocialEntity = new SocialAccountEntity();
                newSocialEntity.setSocialId(socialId);
                newSocialEntity.setMember(memberEntity);
                newSocialEntity.setProvider("KAKAO");
                socialAccountRepository.save(newSocialEntity);
            }

            // ✨ 영속성 프록시 1:1 탐색 버그 완벽 방어 코드 적용
            Optional<MemberProfileEntity> profileOpt = memberProfileRepository.findById(memberEntity.getId());
            if (profileOpt.isEmpty()) {
                isNewUser = true;
            }
        }

        // 4. 모래묻은 키보드 서비스 전용 JWT 토큰 발행
        String appAccessToken = jwtUtil.createJwt(
                memberEntity.getId(),
                memberEntity.getUsername(),
                List.of("USER")
        );

        // 5. 공용 DTO 규격으로 리턴 (롬복 대소문자 패치 완료 버전)
        return SocialLoginRespDto.builder()
                .token(appAccessToken)
                .isNewUser(isNewUser)
                .email(email)
                .build();
    }

    // 🟨 카카오 토큰 교환 RestTemplate 로직
    private String getKakaoAccessToken(SocialLoginReqDto dto) {
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret); // 💡 보안에서 활성화한 시크릿 키
        params.add("redirect_uri", redirectUri);
        params.add("code", dto.getCode());

        HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(params, headers);
        ResponseEntity<String> response = rt.exchange(
                "https://kauth.kakao.com/oauth/token", // 카카오 토큰 교환 주소
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

    // 🟨 카카오 유저 프로필 요청 RestTemplate 로직
    private JsonNode getKakaoUserInfo(String accessToken) {
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<Void> profileRequest = new HttpEntity<>(headers);
        ResponseEntity<String> response = rt.exchange(
                "https://kapi.kakao.com/v2/user/me", // 카카오 유저 정보 조회 주소
                HttpMethod.GET,
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