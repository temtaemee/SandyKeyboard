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

        // 1. 🎉 [수정] 이메일 주소로 실제 회원 엔티티를 먼저 정확하게 낚아챕니다.
        MemberEntity member = memberRepository.findByProfileEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("해당 이메일로 가입된 회원 정보가 존재하지 않습니다."));

        // 2. 🔥 [수정] 이메일 주소가 아닌, 회원의 진짜 아이디(member.getUsername())로 인증 여부를 검사합니다!
        if (!memberService.isVerifiedEmail(member.getUsername())) {
            throw new RuntimeException("이메일 인증 필요");
        }

        // 3. 이미 소셜 계정이 다른 회원과 연동되어 있는지 검사 (기존 유지)
        boolean exists = socialAccountRepository
                .findBySocialIdAndProvider(
                        dto.getSocialId(),
                        dto.getProvider()
                )
                .isPresent();

        if (exists) {
            throw new RuntimeException("이미 연동된 계정");
        }

        // 4. 이 회원에게 이미 동일한 소셜 공급자(예: 카카오)가 연동되어 있는지 검사 (기존 유지)
        if (socialAccountRepository.existsByMemberAndProvider(
                member,
                dto.getProvider()
        )) {
            throw new RuntimeException("이미 해당 소셜이 연동되어 있습니다.");
        }

        // 5. 안전하게 매핑 관계 생성 후 저장 (기존 유지)
        SocialAccountEntity social = new SocialAccountEntity();
        social.setSocialId(dto.getSocialId());
        social.setProvider(dto.getProvider());
        social.setMember(member);

        socialAccountRepository.save(social);

        // 6. 🔥 [수정] 인증 성공 세트에서 지울 때도 진짜 아이디(member.getUsername())를 지정해 깔끔히 청소합니다.
        memberService.removeVerifiedEmail(member.getUsername());
    }
}
