package com.kh.app.member.dto.request;

import com.kh.app.member.entity.MemberEntity;
import lombok.Getter;

@Getter
public class MemberLoginReqDto {

    private String username;
    private String password;

    public MemberEntity toEntity(){
        return MemberEntity.builder()
                .username(username)
                .password(password)
                .build();
    }
}
