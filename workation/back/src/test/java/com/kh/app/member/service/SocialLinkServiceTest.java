package com.kh.app.member.service;

import com.kh.app.member.dto.request.SocialLinkReqDto;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.member.repository.SocialAccountRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SocialLinkServiceTest {

    @Mock
    private MemberService memberService;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private SocialAccountRepository socialAccountRepository;

    @InjectMocks
    private SocialLinkService socialLinkService;

    @Test
    void socialLinkRejectsUnverifiedEmail() {
        SocialLinkReqDto dto = socialLinkReqDto();
        MemberEntity member = new MemberEntity();
        member.setUsername("user_username");

        when(memberRepository.findByProfileEmail(dto.getEmail())).thenReturn(Optional.of(member));
        when(memberService.isVerifiedEmail(member.getUsername())).thenReturn(false);

        assertThatThrownBy(() -> socialLinkService.socialLink(dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("이메일 인증 필요");

        verify(socialAccountRepository, never()).save(any());
    }

    @Test
    void socialLinkRejectsAlreadyLinkedProviderForMember() {
        SocialLinkReqDto dto = socialLinkReqDto();
        MemberEntity member = new MemberEntity();
        member.setUsername("user_username");

        when(memberRepository.findByProfileEmail(dto.getEmail())).thenReturn(Optional.of(member));
        when(memberService.isVerifiedEmail(member.getUsername())).thenReturn(true);
        when(socialAccountRepository.findBySocialIdAndProvider(dto.getSocialId(), dto.getProvider()))
                .thenReturn(Optional.empty());
        when(socialAccountRepository.existsByMemberAndProvider(member, dto.getProvider())).thenReturn(true);

        assertThatThrownBy(() -> socialLinkService.socialLink(dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("이미 해당 소셜이 연동되어 있습니다.");

        verify(socialAccountRepository, never()).save(any());
    }

    private SocialLinkReqDto socialLinkReqDto() {
        SocialLinkReqDto dto = new SocialLinkReqDto();
        dto.setEmail("user@example.com");
        dto.setProvider("KAKAO");
        dto.setSocialId("kakao-123");
        return dto;
    }
}
