package com.kh.app.member.dto.response;
import com.kh.app.member.entity.Role;
import lombok.Builder;
import lombok.Getter;

import java.util.Set;

@Getter
@Builder
public class MemberMeRespDto {
    private Long memberId;
    private String username;
    private Set<Role> roleSet;
}
