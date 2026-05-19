package com.kh.app.member.dto.response;
import com.kh.app.member.entity.Role;
import com.kh.app.product.space.entity.Area;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Builder
public class MemberMeRespDto {
    private Long memberId;
    private String username;
    private Set<Role> roleSet;
    private LocalDateTime joinDate;
    private String name;
    private String phone;
    private String email;
    private String companyName;
    private Area preferredArea;
}
