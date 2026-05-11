package com.kh.app.member.dto.response;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.entity.Role;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class MemberRespDto {

    private Long id;

    private String username;

    private String name;

    private String phone;

    private String email;

    private List<String> roles;

    private String banYn;

    private LocalDateTime createdAt;

    public static MemberRespDto from(
            MemberEntity member,
            String name,
            String phone,
            String email
    ) {

        return MemberRespDto.builder()
                .id(member.getId())
                .username(member.getUsername())
                .name(name)
                .phone(phone)
                .email(email)
                .roles(
                        member.getRoleSet()
                                .stream()
                                .map(Role::name)
                                .toList()
                )
                .banYn(member.getBanYn())
                .createdAt(member.getCreatedAt())
                .build();
    }
}