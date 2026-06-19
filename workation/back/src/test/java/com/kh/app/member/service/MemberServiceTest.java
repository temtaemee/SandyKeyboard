package com.kh.app.member.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.member.repository.ProfileRepository;
import com.kh.app.member.repository.SellerRepository;
import com.kh.app.member.repository.BankRepository;
import com.kh.app.company.repository.CompanyRepository;
import com.kh.app.member.repository.SocialAccountRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private SellerRepository sellerRepository;

    @Mock
    private BankRepository bankRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private EmailSender emailSender;

    @Mock
    private SocialAccountRepository socialAccountRepository;

    @InjectMocks
    private MemberService memberService;

    @Test
    void banMemberSuccess() {
        Long memberId = 1L;
        MemberEntity member = MemberEntity.builder()
                .id(memberId)
                .banYn("N")
                .build();

        when(memberRepository.findById(memberId)).thenReturn(Optional.of(member));

        memberService.banMember(memberId);

        assertThat(member.getBanYn()).isEqualTo("Y");
    }

    @Test
    void banMemberFailsWhenAlreadyBanned() {
        Long memberId = 1L;
        MemberEntity member = MemberEntity.builder()
                .id(memberId)
                .banYn("Y")
                .build();

        when(memberRepository.findById(memberId)).thenReturn(Optional.of(member));

        assertThatThrownBy(() -> memberService.banMember(memberId))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("이미 정지된 회원");
    }

    @Test
    void unbanMemberSuccess() {
        Long memberId = 1L;
        MemberEntity member = MemberEntity.builder()
                .id(memberId)
                .banYn("Y")
                .build();

        when(memberRepository.findById(memberId)).thenReturn(Optional.of(member));

        memberService.unbanMember(memberId);

        assertThat(member.getBanYn()).isEqualTo("N");
    }

    @Test
    void deleteAccountSuccess() {
        Long memberId = 1L;
        MemberEntity member = MemberEntity.builder()
                .id(memberId)
                .deletedAt(null)
                .build();

        when(memberRepository.findById(memberId)).thenReturn(Optional.of(member));

        memberService.deleteAccount(memberId);

        assertThat(member.getDeletedAt()).isNotNull();
    }

    @Test
    void editMyInfoSuccessWhenEmailIsUnchanged() {
        Long memberId = 1L;
        com.kh.app.member.entity.MemberProfileEntity profile = spy(com.kh.app.member.entity.MemberProfileEntity.builder()
                .memberId(memberId)
                .email("test@test.com")
                .name("Old Name")
                .build());

        com.kh.app.member.dto.request.MemberUpdateReqDto dto = new com.kh.app.member.dto.request.MemberUpdateReqDto();
        dto.setName("New Name");
        dto.setEmail("test@test.com"); // unchanged email

        when(profileRepository.findById(memberId)).thenReturn(Optional.of(profile));

        memberService.editMyInfo(memberId, dto);

        verify(profile, times(1)).updateProfile(
                eq("New Name"), any(), eq("test@test.com"), any(), any(), any(), any()
        );
        assertThat(profile.getName()).isEqualTo("New Name");
    }

    @Test
    void editMyInfoFailsWhenEmailIsModified() {
        Long memberId = 1L;
        com.kh.app.member.entity.MemberProfileEntity profile = com.kh.app.member.entity.MemberProfileEntity.builder()
                .memberId(memberId)
                .email("test@test.com")
                .name("Old Name")
                .build();

        com.kh.app.member.dto.request.MemberUpdateReqDto dto = new com.kh.app.member.dto.request.MemberUpdateReqDto();
        dto.setName("New Name");
        dto.setEmail("modified@test.com"); // modified email

        when(profileRepository.findById(memberId)).thenReturn(Optional.of(profile));

        assertThatThrownBy(() -> memberService.editMyInfo(memberId, dto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("이메일은 변경할 수 없습니다.");
    }
}
