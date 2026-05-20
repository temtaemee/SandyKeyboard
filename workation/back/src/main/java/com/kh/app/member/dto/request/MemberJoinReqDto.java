package com.kh.app.member.dto.request;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.MemberProfileEntity;
import com.kh.app.product.space.entity.Area;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MemberJoinReqDto {

    // MEMBER
    private String username;
    private String password;

    // MEMBER_PROFILE
    private String name;
    private String phone;
    private String email;
    private Area preferredArea;

    // 선택값
    private Long companyId;

    // =========================
    // MEMBER 생성
    // =========================
    public MemberEntity toMemberEntity(String encodedPw) {

        return MemberEntity.builder()
                .username(username)
                .password(encodedPw)
                .build();
    }

    // =========================
    // PROFILE 생성
    // =========================
    public MemberProfileEntity toProfileEntity(MemberEntity member) {

        return MemberProfileEntity.builder()
                .member(member)
                .name(name)
                .phone(phone)
                .email(email)
                .preferredArea(preferredArea)
                .build();
    }


}