package com.kh.app.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class MemberListRespDto {

    private Long memberId;

    private String username;

    private String email;
    private String name;

    private String banYn;
    private LocalDateTime deletedAt;

    private Boolean sellerYn;

    private LocalDateTime createdAt;

}
