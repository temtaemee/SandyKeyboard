package com.kh.app.member.service;

import com.kh.app.member.dto.request.SocialLoginReqDto;
import com.kh.app.member.dto.response.SocialLoginRespDto;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.MemberProfileEntity;
import com.kh.app.member.entity.SocialAccountEntity;
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

public class NaverAuthService {

    private final SocialAccountRepository socialAccountRepository;
    private final MemberRepository memberRepository;
    private final ProfileRepository memberProfileRepository;
    private final JwtUtil jwtUtil;

    // 🔑 네이버 개발자 센터에서 발급받은 실제 키 값들을 넣어주세요!
    private final String clientId = "He0BQFaYRyk5Zk2p_Kdy";
    private final String clientSecret = "t4rgYNYw6b";

    @Transactional
    public SocialLoginRespDto naverLogin(SocialLoginReqDto dto) { // ✨ 리턴 타입 변경
        // 1. 네이버 토큰 교환 및 유저 정보 파싱
        String naverAccessToken = getNaverAccessToken(dto);
        JsonNode userInfo = getNaverUserInfo(naverAccessToken);

        JsonNode responseNode = userInfo.get("response");
        String socialId = responseNode.get("id").asText();
        String email = responseNode.has("email") ? responseNode.get("email").asText() : "NAVER_" + socialId;

        // 2. DB 검증 및 신규 유저 판단 플래그 세팅 🔍
        // NaverAuthService.java 의 회원 검증 로직 최종 교체 🛠️

        Optional<SocialAccountEntity> socialOpt =
                socialAccountRepository.findBySocialIdAndProvider(
                        socialId,
                        "NAVER"
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
                newSocialEntity.setProvider("NAVER");
                socialAccountRepository.save(newSocialEntity);

                isNewUser = true;

            } else {

                throw new SocialLinkRequiredException(
                        email,
                        socialId,
                        "NAVER"
                );
            }
        }


        // 3. 서비스 전용 자체 JWT 토큰 발행
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


        // 4. 확장 설계된 공용 DTO 빌더 반환 💯
        return SocialLoginRespDto.builder()
                .token(appAccessToken)
                .isNewUser(isNewUser)
                .roles(memberEntity.getRoleSet().stream().toList())
                .email(email)
                .preferredArea(area)
                .build();
    }

    private String getNaverAccessToken(SocialLoginReqDto dto) {
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