package com.kh.app.member.service;

import com.kh.app.member.dto.request.SocialLinkReqDto;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.SocialAccountEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.member.repository.SocialAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SocialLinkService {
    private final MemberService memberService;
    private final MemberRepository memberRepository;
    private final SocialAccountRepository socialAccountRepository;

    @Transactional
    public void socialLink(SocialLinkReqDto dto) {

        if(!memberService.isVerifiedEmail(dto.getEmail())) {
            throw new RuntimeException("이메일 인증 필요");
        }

        MemberEntity member =
                memberRepository.findMemberByUsername(dto.getEmail())
                        .orElseThrow();

        boolean exists =
                socialAccountRepository
                        .findBySocialIdAndProvider(
                                dto.getSocialId(),
                                dto.getProvider()
                        )
                        .isPresent();

        if(exists){
            throw new RuntimeException("이미 연동된 계정");
        }
        if (
                socialAccountRepository.existsByMemberAndProvider(
                        member,
                        dto.getProvider()
                )
        ) {
            throw new RuntimeException("이미 해당 소셜이 연동되어 있습니다.");
        }
        SocialAccountEntity social = new SocialAccountEntity();

        social.setSocialId(dto.getSocialId());
        social.setProvider(dto.getProvider());
        social.setMember(member);

        socialAccountRepository.save(social);

        memberService.removeVerifiedEmail(dto.getEmail());
    }
}
