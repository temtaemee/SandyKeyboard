package com.kh.app.member.dto.request;

import com.kh.app.product.space.entity.Area;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class SocialJoinReqDto {

    // 1. 회원 식별을 위한 필수 필드 (MEMBER 테이블의 username과 매칭)
    private String username;

    // 2. MEMBER_PROFILE 테이블에 채워넣을 실제 프로필 정보들
    private String name;            // 이름
    private String phone;           // 전화번호
    private String email;           // 연락받을 이메일 (username과 같아도 되고 달라도 됨)
    private Area preferredArea;     // 선호 지역 (Area Enum타입)

    // 3. 주소 정보
    private String zonecode;        // 우편번호
    private String address;         // 기본 주소
    private String addressDetail;   // 상세 주소

    // (선택) 만약 소셜 가입 시 회사 정보도 받아야 한다면 추가
    // private Long companyId;
}