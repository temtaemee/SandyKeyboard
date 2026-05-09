package com.kh.app.member.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class MemberLoginRespDto {

    private String token;

    private Long memberId;

    private String username;

    private List<String> roles;

}