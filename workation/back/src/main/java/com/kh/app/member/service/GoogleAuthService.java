package com.kh.app.member.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.app.member.dto.request.SocialLoginReqDto;
import com.kh.app.member.dto.response.SocialLoginRespDto;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.MemberProfileEntity;
import com.kh.app.member.entity.Role;
import com.kh.app.member.entity.SocialAccountEntity;
import com.kh.app.member.exception.SocialLinkRequiredException;
import com.kh.app.member.exception.SocialWithdrawnUserException;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.member.repository.ProfileRepository;
import com.kh.app.member.repository.SocialAccountRepository;
import com.kh.app.security.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GoogleAuthService {

    private static final String PROVIDER = "GOOGLE";

    private final SocialAccountRepository socialAccountRepository;
    private final MemberRepository memberRepository;
    private final ProfileRepository memberProfileRepository;
    private final JwtUtil jwtUtil;

    @Value("${google.client-id:}")
    private String clientId;

    @Value("${google.client-secret:}")
    private String clientSecret;

    @Value("${google.redirect-uri}")
    private String redirectUri;

    @Transactional
    public SocialLoginRespDto googleLogin(SocialLoginReqDto dto) {
        String googleAccessToken = getGoogleAccessToken(dto);
        JsonNode userInfo = getGoogleUserInfo(googleAccessToken);

        String socialId = userInfo.path("id").asText();
        String email = userInfo.path("email").asText();

        if (!StringUtils.hasText(socialId)) {
            throw new IllegalStateException("Google user id is missing from provider response.");
        }
        if (!StringUtils.hasText(email)) {
            throw new IllegalStateException("Google account email is missing from provider response.");
        }

        LoginMemberResult loginMember = resolveLoginMember(email, socialId);
        MemberEntity memberEntity = loginMember.memberEntity();
        memberEntity.getRoleSet().add(Role.USER);

        String appAccessToken = jwtUtil.createJwt(
                memberEntity.getId(),
                memberEntity.getUsername(),
                List.of("USER")
        );

        String area = null;
        if (memberEntity.getProfile() != null && memberEntity.getProfile().getPreferredArea() != null) {
            area = memberEntity.getProfile().getPreferredArea().name();
        }

        return SocialLoginRespDto.builder()
                .token(appAccessToken)
                .roles(memberEntity.getRoleSet().stream().toList())
                .isNewUser(loginMember.isNewUser())
                .email(email)
                .preferredArea(area)
                .build();
    }

    private LoginMemberResult resolveLoginMember(String email, String socialId) {
        Optional<SocialAccountEntity> linkedSocial =
                socialAccountRepository.findBySocialIdAndProvider(socialId, PROVIDER);

        if (linkedSocial.isPresent()) {
            MemberEntity member = linkedSocial.get().getMember();
            rejectDeleted(member, member.getUsername());
            boolean needsProfile = memberProfileRepository.findById(member.getId()).isEmpty();
            return new LoginMemberResult(member, needsProfile);
        }

        Optional<MemberEntity> existingMemberByUsername = memberRepository.findMemberByUsername(email);
        Optional<MemberEntity> existingMemberByEmail = memberRepository.findByProfileEmail(email); // 👈 추가 필요

        // 둘 중 하나라도 이미 존재하는 유저가 있다면, 신규 가입을 막고 연동 예외를 던짐
        if (existingMemberByUsername.isPresent() || existingMemberByEmail.isPresent()) {
            MemberEntity member = existingMemberByUsername.orElseGet(existingMemberByEmail::get);
            rejectDeleted(member, email);

            // 이 예외가 터져야 프론트엔드가 "이미 가입된 이메일입니다. 연동하시겠습니까?" 팝업을 띄울 수 있음
            throw new SocialLinkRequiredException(email, socialId, PROVIDER);
        }

        MemberEntity member = new MemberEntity();
        member.setUsername(email);
        member.setPassword("");
        member.getRoleSet().add(Role.USER);
        memberRepository.save(member);

        SocialAccountEntity social = new SocialAccountEntity();
        social.setSocialId(socialId);
        social.setMember(member);
        social.setProvider(PROVIDER);
        socialAccountRepository.save(social);

        return new LoginMemberResult(member, true);
    }

    private void rejectDeleted(MemberEntity member, String email) {
        if (member.getDeletedAt() != null) {
            throw new SocialWithdrawnUserException("탈퇴한 회원입니다.", email);
        }
    }

    private String getGoogleAccessToken(SocialLoginReqDto dto) {
        validateGoogleConfig();

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
        ResponseEntity<String> response;
        try {
            response = rt.exchange(
                    "https://oauth2.googleapis.com/token",
                    HttpMethod.POST,
                    tokenRequest,
                    String.class
            );
        } catch (RestClientResponseException e) {
            throw new IllegalStateException("Google token request failed: "
                    + e.getStatusCode().value() + " " + e.getResponseBodyAsString(), e);
        }

        try {
            return new ObjectMapper().readTree(response.getBody()).get("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("Google token parsing failed", e);
        }
    }

    private JsonNode getGoogleUserInfo(String accessToken) {
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        HttpEntity<Void> profileRequest = new HttpEntity<>(headers);
        ResponseEntity<String> response;
        try {
            response = rt.exchange(
                    "https://www.googleapis.com/oauth2/v2/userinfo",
                    HttpMethod.GET,
                    profileRequest,
                    String.class
            );
        } catch (RestClientResponseException e) {
            throw new IllegalStateException("Google userinfo request failed: "
                    + e.getStatusCode().value() + " " + e.getResponseBodyAsString(), e);
        }

        try {
            return new ObjectMapper().readTree(response.getBody());
        } catch (Exception e) {
            throw new RuntimeException("Google userinfo parsing failed", e);
        }
    }

    private void validateGoogleConfig() {
        if (!StringUtils.hasText(clientId) || !StringUtils.hasText(clientSecret)) {
            throw new IllegalStateException("Google OAuth config is missing. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.");
        }
    }

    private record LoginMemberResult(MemberEntity memberEntity, boolean isNewUser) {
    }
}
