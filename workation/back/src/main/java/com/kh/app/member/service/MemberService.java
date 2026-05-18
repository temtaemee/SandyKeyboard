package com.kh.app.member.service;

import com.kh.app.common.dto.PageRespDto;
import com.kh.app.member.dto.request.MemberJoinReqDto;
import com.kh.app.member.dto.request.MemberSearchCondDto;
import com.kh.app.member.dto.request.SellerApplyReqDto;
import com.kh.app.member.dto.request.SellerSearchCondDto;
import com.kh.app.member.dto.response.MemberListRespDto;
import com.kh.app.member.dto.response.MemberMeRespDto;
import com.kh.app.member.entity.*;
import com.kh.app.member.repository.BankRepository;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.member.repository.ProfileRepository;
import com.kh.app.member.repository.SellerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class MemberService {
    private final BCryptPasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;
    private final ProfileRepository profileRepository;
    private final SellerRepository sellerRepository;
    private final BankRepository bankRepository;

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

        @Transactional
        public void registerSeller(SellerApplyReqDto reqDto, Long memberId) {
            // 1. 이미 판매자인지 중복 체크
            if (sellerRepository.existsById(memberId)) {
                throw new RuntimeException("이미 등록된 판매자입니다.");
            }
            // 2. MemberEntity 조회
            MemberEntity member = memberRepository.findById(memberId)
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));
            // 3. BankEntity 조회 (reqDto에 담긴 bankId 활용)
            BankEntity bank = bankRepository.findById(reqDto.getBankId())
                    .orElseThrow(() -> new RuntimeException("존재하지 않는 은행 정보입니다."));
            // 4. 권한 추가 (SELLER 권한 부여)
            // 중복 추가 방지를 위해 contains 체크를 하거나 Set의 특성을 활용합니다.
            if (!member.getRoleSet().contains(Role.SELLER)) {
                member.getRoleSet().add(Role.SELLER);
            }
            SellerEntity sellerEntity = reqDto.toSellerEntity(bank, member);
            sellerRepository.save(sellerEntity);
        }

    public MemberMeRespDto getMyInfo(String username) {

        MemberEntity member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("회원 없음"));
        MemberProfileEntity memberProfile = member.getProfile();
        String companyName = null;
        if (memberProfile.getCompany() != null){
            companyName = memberProfile.getCompany().getCompanyName();
        }
        return MemberMeRespDto.builder()
                .memberId(member.getId())
                .joinDate(member.getCreatedAt())
                .username(member.getUsername())
                .roleSet(member.getRoleSet())
                .name(memberProfile.getName())
                .phone(memberProfile.getPhone())
                .email(memberProfile.getEmail())
                .companyName(companyName)
                .build();
    }


    public PageRespDto<MemberListRespDto> searchMembers(MemberSearchCondDto dto) {

        List<MemberListRespDto> list = memberRepository.searchMembers(dto);

        long totalCount = memberRepository.countMembers(dto);

        int totalPage =
                (int) Math.ceil((double) totalCount / dto.getSize());

        return PageRespDto.<MemberListRespDto>builder()
                .content(list)
                .currentPage(dto.getPage())
                .size(dto.getSize())
                .totalCount(totalCount)
                .totalPage(totalPage)
                .build();
    }

    public PageRespDto<MemberListRespDto> searchSellers(SellerSearchCondDto dto) {
        List<MemberListRespDto> list = memberRepository.searchSellers(dto);

        long totalCount = memberRepository.countSellers(dto);

        int totalPage =
                (int) Math.ceil((double) totalCount / dto.getSize());

        return PageRespDto.<MemberListRespDto>builder()
                .content(list)
                .currentPage(dto.getPage())
                .size(dto.getSize())
                .totalCount(totalCount)
                .totalPage(totalPage)
                .build();
    }
}
