package com.kh.app.member.service;

import com.kh.app.member.dto.request.SocialLoginReqDto;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.exception.SocialLinkRequiredException;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.member.repository.ProfileRepository;
import com.kh.app.member.repository.SocialAccountRepository;
import com.kh.app.security.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedConstruction;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KakaoAuthServiceTest {

    @Mock
    private SocialAccountRepository socialAccountRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private ProfileRepository memberProfileRepository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private KakaoAuthService kakaoAuthService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(kakaoAuthService, "clientId", "test-client-id");
        ReflectionTestUtils.setField(kakaoAuthService, "redirectUri", "test-redirect-uri");
        ReflectionTestUtils.setField(kakaoAuthService, "clientSecret", "test-client-secret");
        ReflectionTestUtils.setField(kakaoAuthService, "clientSecretEnabled", false);
    }

    @Test
    void kakaoLoginThrowsSocialLinkRequiredWhenEmailAlreadyExists() {
        SocialLoginReqDto dto = new SocialLoginReqDto();
        dto.setCode("mock-auth-code");

        String tokenResponse = "{\"access_token\":\"mock-access-token\"}";
        String userInfoResponse = "{\"id\":12345,\"kakao_account\":{\"email\":\"user@example.com\"}}";

        MemberEntity existingMember = MemberEntity.builder()
                .id(1L)
                .username("user@example.com")
                .banYn("N")
                .build();

        when(socialAccountRepository.findBySocialIdAndProvider("12345", "KAKAO")).thenReturn(Optional.empty());
        when(memberRepository.findMemberByUsername("user@example.com")).thenReturn(Optional.of(existingMember));

        try (MockedConstruction<RestTemplate> mocked = mockConstruction(RestTemplate.class, (mock, context) -> {
            when(mock.exchange(contains("oauth/token"), eq(HttpMethod.POST), any(HttpEntity.class), eq(String.class)))
                    .thenReturn(new ResponseEntity<>(tokenResponse, HttpStatus.OK));
            when(mock.exchange(contains("user/me"), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class)))
                    .thenReturn(new ResponseEntity<>(userInfoResponse, HttpStatus.OK));
        })) {
            assertThatThrownBy(() -> kakaoAuthService.kakaoLogin(dto))
                    .isInstanceOf(SocialLinkRequiredException.class)
                    .hasFieldOrPropertyWithValue("email", "user@example.com")
                    .hasFieldOrPropertyWithValue("socialId", "12345")
                    .hasFieldOrPropertyWithValue("provider", "KAKAO");
        }
    }
}
