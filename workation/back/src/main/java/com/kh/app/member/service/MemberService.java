package com.kh.app.member.service;

import com.kh.app.member.dto.request.MemberJoinReqDto;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.MemberProfileEntity;
import com.kh.app.member.entity.Role;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.member.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class MemberService {
    private final BCryptPasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;

    @Transactional
    public void join(MemberJoinReqDto dto) {

        String encodedPw = passwordEncoder.encode(dto.getPassword());

        // MEMBER 저장
        MemberEntity member = dto.toMemberEntity(encodedPw);
        member.getRoleSet().add(Role.USER);
        memberRepository.save(member);

        // PROFILE 저장
        MemberProfileEntity profile = dto.toProfileEntity(member);
        profileRepository.save(profile);

    }
}
