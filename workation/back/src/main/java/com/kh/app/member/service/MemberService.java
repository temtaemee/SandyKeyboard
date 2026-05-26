package com.kh.app.member.service;

import com.kh.app.common.dto.PageRespDto;
import com.kh.app.member.dto.request.*;
import com.kh.app.member.dto.response.FindUsernameRespDto;
import com.kh.app.member.dto.response.MemberListRespDto;
import com.kh.app.member.dto.response.MemberMeRespDto;
import com.kh.app.member.dto.response.MemberRespDto;
import com.kh.app.member.entity.*;
import com.kh.app.member.repository.BankRepository;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.member.repository.ProfileRepository;
import com.kh.app.member.repository.SellerRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

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
    private final JavaMailSender mailSender;
    private final Map<String, String> authCodeStore
            = new ConcurrentHashMap<>();
    private final Set<String> verifiedEmailSet = new HashSet<>();

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

        // 1. 프로필이나 회사 정보가 없을 때를 대비해 초기값을 null(또는 빈 문자열 "")로 세팅합니다.
        String companyName = null;
        String name = null;
        String phone = null;
        String email = null;
        String zonecode = null;
        String address = null;
        String addressDetail = null;

        // 2. 핵심 널 방어: memberProfile이 진짜로 존재할 때만 데이터를 쏙쏙 꺼내옵니다! ✨
        if (memberProfile != null) {
            name = memberProfile.getName();
            phone = memberProfile.getPhone();
            email = memberProfile.getEmail();
            zonecode = memberProfile.getZonecode();
            address = memberProfile.getAddress();
            addressDetail = memberProfile.getAddressDetail();

            if (memberProfile.getCompany() != null) {
                companyName = memberProfile.getCompany().getCompanyName();
            }
        } else {
            // 💡 필요하다면 소셜 신규 가입자를 위해 기본 가이드 텍스트를 채워줄 수 있습니다. (선택 사항)
            name = "소셜 가입 회원";
            email = member.getUsername(); // 네이버 로그인 시 저장한 이메일 매핑
        }

        // 3. 기존 빌더 패턴 그대로 변수만 매핑해주면 끝! 코드 구조가 하나도 깨지지 않습니다. 💯
        return MemberMeRespDto.builder()
                .memberId(member.getId())
                .joinDate(member.getCreatedAt())
                .username(member.getUsername())
                .roleSet(member.getRoleSet())
                .name(name)
                .phone(phone)
                .email(email)
                .zonecode(zonecode)
                .address(address)
                .addressDetail(addressDetail)
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

    public MemberRespDto getMemberDetail(Long id) {
        MemberEntity member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("회원 없음"));
        MemberProfileEntity profile = member.getProfile();
        return MemberRespDto.from(
                member,
                profile.getName(),
                profile.getPhone(),
                profile.getEmail()
        );
    }

    @Transactional
    public void banMember(Long id) {
        MemberEntity member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("회원 없음"));
        if ("Y".equals(member.getBanYn())) {
            throw new RuntimeException("이미 정지된 회원");
        }
        member.ban();
    }

    @Transactional
    public void unbanMember(Long id) {
        MemberEntity member = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("회원 없음"));
        member.unban();
    }

    @Transactional
    public void editMyInfo(Long memberId, MemberUpdateReqDto dto) {
        MemberProfileEntity profile = profileRepository.findById(memberId).orElseThrow(() -> new RuntimeException("회원 없음"));
        profile.updateProfile(
                dto.getName(),
                dto.getPhone(),
                dto.getEmail(),
                dto.getPreferredArea(),
                dto.getZonecode(),
                dto.getAddress(),
                dto.getAddressDetail()
        );
    }

    @Transactional
    public void updatePassword(Long memberId, MemberPasswordUpdateReqDto dto) {
        MemberEntity member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("회원 없음"));
        // 현재 비밀번호 검증
        if (!passwordEncoder.matches(
                dto.getCurrentPassword(),
                member.getPassword()
        )) {
            throw new RuntimeException("현재 비밀번호 불일치");
        }
        // 새 비밀번호 확인 검증
        if (!dto.getNewPassword()
                .equals(dto.getNewPasswordCheck())) {
            throw new RuntimeException("새 비밀번호 확인 불일치");
        }
        // 암호화
        String encodedPw =
                passwordEncoder.encode(dto.getNewPassword());
        // 엔티티 변경
        member.changePassword(encodedPw);
    }
    @Transactional
    public void deleteAccount(Long memberId) {
        MemberEntity member = memberRepository.findById(memberId).orElseThrow(() -> new RuntimeException("회원 없음"));
        member.delete();
    }

    public FindUsernameRespDto findUsername(FindUsernameReqDto dto) {
        MemberProfileEntity profile =
                profileRepository
                        .findByNameAndEmail(
                                dto.getName(),
                                dto.getEmail()
                        )
                        .orElseThrow();

        return FindUsernameRespDto.builder()
                .username(
                        profile.getMember().getUsername()
                )
                .build();

    }

    public void sendEmailCode(FindPasswordReqDto dto) {
        profileRepository.findByMemberUsernameAndEmail(dto.getUsername(), dto.getEmail())
                .orElseThrow(() -> new RuntimeException("회원 없음"));

        String code = String.valueOf((int)((Math.random() * 900000) + 100000));

        // 1. MimeMessage 객체 생성
        MimeMessage message = mailSender.createMimeMessage();

        try {
            // 2. MimeMessageHelper를 이용해 편리하게 세팅 (true는 멀티파트/첨부파일 사용 여부)
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(dto.getEmail());
            helper.setSubject("[모래묻은키보드] 비밀번호 재설정 인증코드");

            // 3. HTML 문자열 작성
            String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;'>"
                    + "<h2>[모래묻은키보드] 비밀번호 재설정</h2>"
                    + "<p>안녕하세요. 요청하신 비밀번호 재설정 인증코드입니다.</p>"
                    + "<div style='background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; color: #4A90E2; letter-spacing: 5px;'>"
                    +     code
                    + "</div>"
                    + "<p style='color: #888; font-size: 12px; margin-top: 20px;'>본 인증코드는 비밀번호 재설정 페이지에서만 사용 가능합니다.</p>"
                    + "</div>";

            // 4. 핵심: 두 번째 인자에 true를 넣어야 HTML로 렌더링됩니다!
            helper.setText(htmlContent, true);

        } catch (Exception e) {
            log.error("메일 생성 중 에러 발생", e);
            throw new RuntimeException("메일 발송 실패");
        }

        authCodeStore.put(dto.getEmail(), code);

        // 5. 메일 발송
        mailSender.send(message);
    }

    public void verifyEmailCode(
            VerifyEmailCodeReqDto dto
    ) {
        String savedCode =
                authCodeStore.get(dto.getEmail());
        if (savedCode == null) {
            throw new RuntimeException("인증코드 없음");
        }
        if (!savedCode.equals(dto.getCode())) {
            throw new RuntimeException("인증코드 불일치");
        }
        verifiedEmailSet.add(dto.getEmail());
    }

    @Transactional
    public void resetPassword(ResetPasswordReqDto dto) {
        // 1. 인증 여부 체크
        if (!verifiedEmailSet.contains(dto.getEmail())) {
            throw new RuntimeException("인증되지 않은 사용자");
        }
        // 2. 비밀번호 확인
        if (!dto.getNewPassword()
                .equals(dto.getNewPasswordCheck())) {
            throw new RuntimeException("비밀번호 불일치");
        }
        // 3. 회원 조회 (email → profile → member)
        MemberProfileEntity profile =
                profileRepository
                        .findByEmail(dto.getEmail())
                        .orElseThrow();
        MemberEntity member = profile.getMember();

        // 4. 비밀번호 변경
        String encoded =
                passwordEncoder.encode(dto.getNewPassword());

        member.changePassword(encoded);

        // 5. 인증 상태 제거 (1회성)
        verifiedEmailSet.remove(dto.getEmail());
    }

    @Transactional
    public void createSocialProfile(SocialJoinReqDto dto) {
        // 1. 소셜 로그인 시 이미 생성해둔 Member를 username(이메일)으로 찾습니다.
        MemberEntity member = memberRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("해당 소셜 계정이 존재하지 않습니다."));

        // 2. 이 유저를 위한 프로필 엔티티를 빌더로 생성합니다.
        MemberProfileEntity profile = MemberProfileEntity.builder()
                .member(member) // 1:1 관계 매핑
                .name(dto.getName())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .preferredArea(dto.getPreferredArea())
                .zonecode(dto.getZonecode())
                .address(dto.getAddress())
                .addressDetail(dto.getAddressDetail())
                .build();

        // 3. 프로필 저장 완료!
        profileRepository.save(profile);
    }
}
