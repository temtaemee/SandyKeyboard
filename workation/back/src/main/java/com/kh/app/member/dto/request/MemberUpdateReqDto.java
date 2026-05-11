package com.kh.app.member.dto.request;

import lombok.Getter;

@Getter
public class MemberUpdateReqDto {

    private String password;

    private String name;

    private String phone;

    private String email;

}