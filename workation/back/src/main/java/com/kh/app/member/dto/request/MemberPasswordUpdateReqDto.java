package com.kh.app.member.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MemberPasswordUpdateReqDto {

    private String currentPassword;
    private String newPassword;
    private String newPasswordCheck;

}